"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfiguration = void 0;
exports.baseConfiguration = {
    apiVersion: 1,
    name: process.env.DIG_SERVICE_NAME || "",
    log: {
        level: process.env.DIG_SERVICE_LOG_LEVEL || "info",
        autoLogging: process.env.DIG_SERVICE_LOG_AUTOLOGGING === "true" || false,
    },
    server: {
        port: parseInt(process.env.DIG_SERVICE_SERVER_PORT) || 8008,
        auth: {
            enabled: (process.env.COR_SERICE_AUTH_ENABLED === "true") ? true : false,
            idp: {
                jwksUri: process.env.COR_SERVICE_AUTH_IDP_JWKS_URI || ""
            }
        }
    },
    openAPI: {
        path: process.env.DIG_SERVICE_OPEN_API_SPEC,
        validateRequests: true,
        validateResponses: false
    }
};
