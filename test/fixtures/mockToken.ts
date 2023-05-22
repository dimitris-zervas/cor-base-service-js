import { v4 as uuid4 } from "uuid";
// import { TokenPayload, TokenHeader } from '../../src/types/token';

const tenantId = uuid4();
const appId = uuid4();
/**
 * 
 * header: {
 *  typ: "JWT",
 *  kid: The token must have a header claim that matches the key in the jwks_uri that signed the token.
 *  iss:  Must match the issuer that is configured for the authorizer.
 *  aud: or client_id Must match one of the audience entries that is configured for the authorizer.
 *  exp: must be after the current time in UTC
 *  nbf: must be before the current time in UTC
 *  iat: must be before the current time in UTC
 *  scope or scp: The token must include at least one of the scopes in the route's authorizationScopes.
 * 
 * }
 */

export const getMockedToken = () => ({
  header: {
    typ: "JWT",
    alg: "RS256",
    x5t: "x5t-string",
    kid: "kid-string"
  },
  payload: {
    aud: `api://${appId}`,
    iss: `https://sts.windows.net/${tenantId}/`,
    iat: 1667993866,
    nbf: 1667993866,
    exp: 1667998393,
    acr: "1",
    aio: "aio-string",
    amr: [
      "pwd"
    ],
    appid: appId,
    appidacr: "0",
    family_name: "Testing",
    given_name: "Unit",
    ipaddr: "1.2.3.4",
    name: "Unit Testing",
    oid: uuid4(),
    rh: "rh-string",
    scp: "Scope.read",
    sub: "sub-string",
    tid: tenantId,
    unique_name: "unit.testing@lighthouse-dig.com",
    upn: "unit.testing@lighthouse-dig.com",
    uti: "uti-string",
    ver: "1.0"
  },
  signature: "signature-string"
});