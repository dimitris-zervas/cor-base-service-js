import { JwtHeader } from "jwt-decode";

export { JwtPayload as TokenPayload } from "jwt-decode";

export interface TokenHeader extends JwtHeader {
  kid?: string;
} 