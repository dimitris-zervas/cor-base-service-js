"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateWayTimeout = exports.BadGateWayError = exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const http_status_codes_1 = require("http-status-codes");
/** 400 Bad Request */
const BadRequestError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: message || http_status_codes_1.ReasonPhrases.BAD_REQUEST
    };
};
exports.BadRequestError = BadRequestError;
/** 401 Unauthorized */
const UnauthorizedError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        message: message || http_status_codes_1.ReasonPhrases.UNAUTHORIZED
    };
};
exports.UnauthorizedError = UnauthorizedError;
/** 403 Forbidden */
const ForbiddenError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.FORBIDDEN,
        message: message || http_status_codes_1.ReasonPhrases.FORBIDDEN
    };
};
exports.ForbiddenError = ForbiddenError;
/** 404 Not Found */
const NotFoundError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.NOT_FOUND,
        message: message || http_status_codes_1.ReasonPhrases.NOT_FOUND
    };
};
exports.NotFoundError = NotFoundError;
/** 500 Internal Server Error */
const InternalServerError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: message || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR
    };
};
exports.InternalServerError = InternalServerError;
/** 502 Bad Gateway */
const BadGateWayError = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.BAD_GATEWAY,
        message: message || http_status_codes_1.ReasonPhrases.BAD_GATEWAY
    };
};
exports.BadGateWayError = BadGateWayError;
/** 504 Gateway Timeout */
const GateWayTimeout = (message) => {
    return {
        status: http_status_codes_1.StatusCodes.GATEWAY_TIMEOUT,
        message: message || http_status_codes_1.ReasonPhrases.GATEWAY_TIMEOUT
    };
};
exports.GateWayTimeout = GateWayTimeout;
