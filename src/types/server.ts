import type { Request } from 'express';
import type { TokenPayload } from './token'; 

export interface AuthRequest extends Request {
  auth?: {
    token: TokenPayload
  }
}
