import { ResponseError } from './types/errors';
/** 400 Bad Request */
export declare const BadRequestError: (message?: string) => ResponseError;
/** 401 Unauthorized */
export declare const UnauthorizedError: (message?: string) => ResponseError;
/** 403 Forbidden */
export declare const ForbiddenError: (message?: string) => ResponseError;
/** 404 Not Found */
export declare const NotFoundError: (message?: string) => ResponseError;
/** 500 Internal Server Error */
export declare const InternalServerError: (message?: string) => ResponseError;
/** 502 Bad Gateway */
export declare const BadGateWayError: (message?: string) => ResponseError;
/** 504 Gateway Timeout */
export declare const GateWayTimeout: (message?: string) => ResponseError;
//# sourceMappingURL=errors.d.ts.map