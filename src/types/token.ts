import { JwtHeader } from "jwt-decode";

export { JwtPayload as TokenPayload } from "jwt-decode";

export interface TokenHeader extends JwtHeader {
  kid?: string;
}

export type UserIdPayload = {
  oid: string;
}