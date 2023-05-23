import { OpenAPIConfiguration, ServiceConfiguration } from "../../../src/types/config";
import { createLogger } from "../../../src";
import { IncomingMessage } from "http";
import { socketAuthentication } from "../../../src/auth/ws";
import { Socket } from "net";
import { UnauthorizedError } from "../../../src/errors";

jest.mock("../../../src/auth/utils");
const mockedAuthModule = require("../../../src/auth/utils");


const logger = createLogger("Test_auth.authentication", "silent");
const config: ServiceConfiguration = {
  apiVersion: 1,
  name: "auth.spec",
  
  log: {
    autoLogging: false,
    level: "silent"
  },
  server: {
    auth: {
      enabled: true,
      idp: {
        jwksUri: "mock-url"
      }
    },
    port: 3000,
    ignoreAuthPaths: [],
    ignoreLogPaths: []
  },
  openAPI: {} as OpenAPIConfiguration,
}

describe ("Unit Testing > Auth > WS authentication", () => {

  afterEach(() => {
    config.server.auth.idp!.jwksUri = "mock-url";
  });

  describe("Configuration is not proper because", () => {
    
    it("missess the jwksUri", async () => {
      config.server.auth.idp!.jwksUri = "";
      const req = {} as IncomingMessage;
      await socketAuthentication(req, config, logger).catch(err => {
        expect(err.status).toEqual(500);
      });
    });

    it("misses the Authorization header", async () => {
      const req = new IncomingMessage({} as Socket);
      await socketAuthentication(req, config, logger).catch(err => {
        expect(err.status).toEqual(401);
      });
    });

    it("has an unverifiable token in the header", async () => {
      mockedAuthModule.getTokenFromWebSocket.mockReturnValue("wrong-token");
      mockedAuthModule.verifyJWT.mockImplementation(() => {
        throw UnauthorizedError();
      });

      const req = new IncomingMessage({} as Socket);
      req.headers.authorization = "Bearer Token";
      // req.headers = {'Authorization': 'Bearer Token'};
      await socketAuthentication(req, config, logger).catch(err => {
        expect(err.status).toEqual(401);
      });
    });

  });
})