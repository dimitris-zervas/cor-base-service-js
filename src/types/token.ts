import { JwtHeader, JwtPayload } from "jwt-decode";

export type TokenPayload = JwtPayload & {
  oid: string;
}

export interface TokenHeader extends JwtHeader {
  kid?: string;
}

export type UserIdPayload = {
  oid: string;
}