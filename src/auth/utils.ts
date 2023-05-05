import type { Request } from 'express';
import type { pino } from 'pino';
import jwtDecode from 'jwt-decode';
import type { TokenHeader, TokenPayload} from '../types/token';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '../errors';


export function getTokenFromHeader(req: Request): string | undefined {
  let authHeader = req.get('Authorization');
  if (Array.isArray(authHeader)) {
    authHeader = authHeader[0]
  }

  return authHeader?.split('Bearer ').pop();
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
    logger.error({ token, kid, idpClient, error}, 'Error retrieving signing key');
    throw InternalServerError();
  });

  return key.getPublicKey();
}


export const verifyJWT = async (jwksUri: string, token: string, logger: pino.Logger): Promise<TokenPayload> => {
  const signingKey = await getSigningKey(jwksUri, token, logger);
  const payload = <TokenPayload>jwt.verify(token, signingKey);
  // TODO: Check the iss here!!!
  return payload;
}