import { ServiceConfiguration, OpenAPIConfiguration, ExternalService } from "../../../src"

export const properConfig: ServiceConfiguration = {
  server: {
    auth: {
      enabled: true,
      idp: {
        jwksUri: "https://idp.example.com/.well-known/jwks.json"
      }
    },
    port: 8008,

  },
  name: "auth.http.spec",
  log: {
    autoLogging: false,
    level: "debug",
  },
  apiVersion: 1,
  openAPI: {} as OpenAPIConfiguration,
  externalServices: {} as ExternalService
}