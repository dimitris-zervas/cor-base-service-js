import { ServiceConfiguration } from './types/config';
import { LogLevel } from './types/logger';

export const baseConfiguration: ServiceConfiguration = {
  apiVersion: 1,
  name: process.env.DIG_SERVICE_NAME || "",
  log: {
    level: process.env.DIG_SERVICE_LOG_LEVEL as LogLevel || "info" as LogLevel,
    autoLogging: process.env.DIG_SERVICE_LOG_AUTOLOGGING === "true" || false,
  },
  server: {
    port: parseInt(<string>process.env.DIG_SERVICE_SERVER_PORT) || 8008,
    auth: {
      enabled: (process.env.COR_SERICE_AUTH_ENABLED === "true") ? true : false,
      idp: {
        jwksUri: process.env.COR_SERVICE_AUTH_IDP_JWKS_URI || ""
      }
    }
  },
  openAPI: {
    path: process.env.DIG_SERVICE_OPEN_API_SPEC as string | "",
    validateRequests: true,
    validateResponses: false
  }
}