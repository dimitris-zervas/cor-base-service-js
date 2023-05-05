import { NextFunction, Response } from 'express';
import type { AuthRequest } from '../types/server';
export declare const authentication: (excludedPaths: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=http.d.ts.map