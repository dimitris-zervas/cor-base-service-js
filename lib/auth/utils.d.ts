import type { Request } from 'express';
import type { pino } from 'pino';
import type { TokenPayload } from '../types/token';
export declare function getTokenFromHeader(req: Request): string | undefined;
export declare const getSigningKey: (jwksUri: string, token: string, logger: pino.Logger) => Promise<string>;
export declare const verifyJWT: (jwksUri: string, token: string, logger: pino.Logger) => Promise<TokenPayload>;
//# sourceMappingURL=utils.d.ts.map