import type { Request } from "express";
import type { pino } from "pino";
import jwtDecode from "jwt-decode";
import type { TokenHeader, TokenPayload} from "../types/token";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { InternalServerError } from "../errors";
import { IncomingMessage } from "http";

export function getTokenFromHeader(req: Request): string | undefined {
  let authHeader = req.get("Authorization");
  if (Array.isArray(authHeader)) {
    authHeader = authHeader[0]
  }

  return authHeader?.split("Bearer ").pop();
}


export const getSigningKey = async (jwksUri: string, token: string, logger: pino.Logger): Promise<string> => {
  const idpClient = jwksClient({
    jwksUri,
    requestHeaders: {},
    timeout: 30000
  });
  
  const decodedHeader = jwtDecode<TokenHeader>(token);
  const kid = decodedHeader.kid as string;
  const key = await idpClient.getSigningKey(kid).catch((error) => {
    logger.error({ token, kid, idpClient, error}, "Error retrieving signing key");
    throw InternalServerError();
  });

  return key.getPublicKey();
}


export const verifyJWT = async (jwksUri: string, token: string, logger: pino.Logger): Promise<TokenPayload> => {
  const signingKey = await getSigningKey(jwksUri, token, logger);
  const payload = <TokenPayload>jwt.verify(token, signingKey);
  // TODO: Check the iss and other claims here!!!
  return payload;
}


/**
 * 
 * @param req The HTTP IncomingMessage object
 * @param logger 
 * @returns 
 * @description Will look for a token in the Authorization header, and if not found, will look for a query parameter named accessToken
 */
export const getTokenFromWebSocket = (req: IncomingMessage, logger: pino.Logger): string | undefined => {
  let token = req.headers.authorization?.split("Bearer ").pop();
  if (!token || token === "") {
    logger.debug({ token }, "Token not found in header, looking for query parameters");
    const location = new URL(req.url as string, `http://${req.headers.host}`);
    const headerToken = location.searchParams.get("accessToken");
    if (headerToken !== null) {
      logger.debug("Token found in query parameter");
      token = headerToken;
    }
  }

  return token;
}