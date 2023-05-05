"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const utils_1 = require("./utils");
const http_status_codes_1 = require("http-status-codes");
const authentication = (excludedPaths) => async function authenticate(req, res, next) {
    const excludeMethods = ['OPTIONS', 'HEAD'];
    const pathTest = excludedPaths.find((path) => (new RegExp(path).test(req.path)));
    if (excludedPaths.includes(req.path)) {
        next();
    }
    else if (excludeMethods.includes(req.method) || pathTest) {
        next();
    }
    else {
        const logger = req.app.get('logger');
        const config = req.app.get('config');
        // Get the IDP public jwksUri
        const jwksUri = config.server.auth.idp?.jwksUri || '';
        if (!jwksUri) {
            logger.error('Authentication is enabled but no JWKS URI is defined');
            res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            return;
        }
        // Get the Token from the Header
        const token = (0, utils_1.getTokenFromHeader)(req) || '';
        // TODO: check this error in the getTokenFromHeader function?
        if (!token) {
            logger.warn("Received Authorization header is either malformed or missing");
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            return;
        }
        try {
            const decodedPayload = await (0, utils_1.verifyJWT)(jwksUri, token, logger);
            req.auth = {
                token: decodedPayload
            };
            next();
        }
        catch (error) {
            logger.warn({ jwtError: error }, 'Error decoding JWT');
            // JWT expired
            if (error.name === 'TokenExpiredError') {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: error.message,
                    expiredAt: error.expiredAt
                });
                // Non valid token
            }
            else if (error.message === "Unauthorized") {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: error.message
                });
            }
            else {
                // An error we are not parsing properly
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR
                });
            }
            ;
        }
    }
};
exports.authentication = authentication;
