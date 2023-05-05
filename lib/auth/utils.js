"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.getSigningKey = exports.getTokenFromHeader = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../errors");
function getTokenFromHeader(req) {
    let authHeader = req.get('Authorization');
    if (Array.isArray(authHeader)) {
        authHeader = authHeader[0];
    }
    return authHeader?.split('Bearer ').pop();
}
exports.getTokenFromHeader = getTokenFromHeader;
const getSigningKey = async (jwksUri, token, logger) => {
    const idpClient = (0, jwks_rsa_1.default)({
        jwksUri,
        requestHeaders: {},
        timeout: 30000
    });
    const decodedHeader = (0, jwt_decode_1.default)(token);
    const kid = decodedHeader.kid;
    const key = await idpClient.getSigningKey(kid).catch((error) => {
        logger.error({ token, kid, idpClient, error }, 'Error retrieving signing key');
        throw (0, errors_1.InternalServerError)();
    });
    return key.getPublicKey();
};
exports.getSigningKey = getSigningKey;
const verifyJWT = async (jwksUri, token, logger) => {
    const signingKey = await (0, exports.getSigningKey)(jwksUri, token, logger);
    const payload = jsonwebtoken_1.default.verify(token, signingKey);
    // TODO: Check the iss here!!!
    return payload;
};
exports.verifyJWT = verifyJWT;
