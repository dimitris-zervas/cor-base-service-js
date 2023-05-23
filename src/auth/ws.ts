import { IncomingMessage } from "http"
import { verifyJWT, getTokenFromWebSocket } from "./utils";
import type { Logger } from 'pino';
import { ServiceConfiguration } from "../types/config";
import { TokenPayload } from "../types/token";
import { InternalServerError, UnauthorizedError } from "../errors";

export const socketAuthentication = async (req: IncomingMessage, config: ServiceConfiguration, logger: Logger): Promise<TokenPayload> => {
  const jwksUri = config.server.auth.idp?.jwksUri || "";
  if (!jwksUri) {
    const errorMessage = 'Authentication is enabled but no Identity Provider URL is defined';
    logger.error(errorMessage);
    throw InternalServerError(errorMessage);
  }

  const token = getTokenFromWebSocket(req, logger);
  if (!token) {
    logger.debug('Token not found in request');
    throw UnauthorizedError();
  }

  try {
    logger.debug({ jwksUri, token}, 'Verifying token with IDP public key');
    return await verifyJWT(jwksUri, token, logger);
  } catch (error: any) {
    logger.warn({ error }, 'Error verifying JWT');
    // TODO: Handle different errors here
    throw UnauthorizedError();
  }
}