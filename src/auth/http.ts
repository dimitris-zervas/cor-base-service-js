import { NextFunction, Response } from "express";
import { verifyJWT, getTokenFromHeader } from "./utils";
import type { AuthRequest } from "../types/server";
import pino from "pino";
import { ServiceConfiguration } from "../types/config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { TokenPayload } from "../types/token";


export const authentication = (excludedPaths: string[]) =>
  async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    const excludeMethods = ["OPTIONS", "HEAD"];

    const pathTest = excludedPaths.find((path) => (new RegExp(path).test(req.path)));
    
    if(excludedPaths.includes(req.path)) {
      next();
    } else if (excludeMethods.includes(req.method) || pathTest) {
      next();
    } else {
      const logger = req.app.get("logger") as pino.Logger;
      const config = req.app.get("config") as ServiceConfiguration;

      // Get the IDP public jwksUri
      const jwksUri = config.server.auth.idp?.jwksUri || "";
      if (!jwksUri) {
        logger.error("Authentication is enabled but no JWKS URI is defined");
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        return;
      }
      
      // Get the Token from the Header
      const token = getTokenFromHeader(req) || "";
      // TODO: check this error in the getTokenFromHeader function?
      if (!token) {
        logger.warn("Received Authorization header is either malformed or missing");
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
      }

      try {
        const decodedPayload: TokenPayload = await verifyJWT(jwksUri, token, logger);
        req.auth = {
          token: decodedPayload
        }
        next();
      } catch (error: any) {
        logger.warn({ jwtError: error}, "Error decoding JWT");
        // JWT expired
        if (error.name === "TokenExpiredError") {
          logger.debug({ error }, "Unauthorized");
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: error.message,
            expiredAt: error.expiredAt
          });
        // Non valid token
        } else if ( error.message === "Unauthorized") {
          logger.debug({ error }, "Unauthorized");
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: error.message
          })
        } else {
        // An error we are not parsing properly
          logger.debug({ error }, "Unauthorized");
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
          });
        }
      }
    }
  }