import { Response, NextFunction } from "express";
import { authentication, AuthRequest } from "../../../src";
import { getMockRes, getMockReq } from "@jest-mock/express";
import { ServiceOptions } from "../../../src/types/config";
import { createLogger } from "../../../src/logger";
import { properConfig } from "./utils";
import { getMockedToken } from "../../fixtures/mockToken";
import { TokenPayload } from "../../../src";

jest.mock("../../../src/auth/utils");
/* tslint:disable no-var-requires */
const mockedAuthModule = require("../../../src/auth/utils");


describe("Unit Testing > Auth > authentication middleware", () => {
  let mockRequest: Partial<AuthRequest>;
  const nextFunction: NextFunction = jest.fn();
  const token = "tokenn";

  const options: ServiceOptions = {
    logger: createLogger("auth.http.spec", "silent"),
    config: properConfig,
  }

  const { res } = getMockRes();

  beforeEach(() => {
    mockRequest = {
      get: (key: string) => {
        if (key === "Authorization") {
          return `Bearer ${token}`
        }
      },
      app: {
        get: (key: keyof ServiceOptions) => options[key]
      },
      method: "GET"
    } as AuthRequest;
  });

  it("should throw a 401 error when the jwt is expired", () => {
    // Mock the getTokenFromHeader
    mockedAuthModule.getTokenFromHeader.mockReturnValueOnce(token);

    // Mock the verifyJWT
    const date = new Date;
    mockedAuthModule.verifyJWT.mockImplementationOnce(() => {
      throw {
        name: "TokenExpiredError",
        message: "jwt expired",
        expiredAt: date
      };
    });

    authentication([])(mockRequest as AuthRequest, res as Response, nextFunction);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "jwt expired",
        expiredAt: date
      })
    );
  });

  it("should throw a 401 error when the jwt is not valid", () => {
    // Mock the getTokenFromHeader
    mockedAuthModule.getTokenFromHeader.mockReturnValueOnce(token);

    // Mock the verifyJWT
    mockedAuthModule.verifyJWT.mockImplementationOnce(() => {
      throw {
        message: "Unauthorized",
      };
    });

    authentication([])(mockRequest as AuthRequest, res as Response, nextFunction);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  it("successfully calls the next function when the token is verified", async () => {
    // Mock the getTokenFromHeader
    mockedAuthModule.getTokenFromHeader.mockReturnValueOnce(token);
    // Mock the verifyJWT
    mockedAuthModule.verifyJWT.mockImplementationOnce(() => {
      return getMockedToken().payload as TokenPayload;
    });

    await authentication([])(mockRequest as AuthRequest, res as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
    expect(mockRequest.auth).toHaveProperty("token");
  });

  it("successfully calls the next function for the excluded method OPTIONS", async () => {
    const req = getMockReq();
    req.method = "OPTIONS";

    await authentication([])(req as AuthRequest, res as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
  });

  it("successfully calls the next function for the excluded path", async () => {
    const req = getMockReq();
    req.method = "OPTIONS";
    req.path = "/excluded";

    await authentication(["/excluded"])(req as AuthRequest, res as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
  });

});

describe("Unit Testing > Auth > Throws", () => {
  const nextFunction: NextFunction = jest.fn();

  const options: ServiceOptions = {
    logger: createLogger("auth.http.spec", "debug"),
    config: properConfig,
  }

  const { res } = getMockRes();

  it("Unauthorized as it misses the Authorization header", async () => {
    const mockRequestWithNoAuthHeader = {
      get: (key: string) => {
        if (key === "Authorization") {
          return undefined;
        }
      },
      app: {
        get: (key: keyof ServiceOptions) => options[key]
      },
      method: "GET"
    } as AuthRequest;

    authentication([])(mockRequestWithNoAuthHeader as AuthRequest, res as Response, nextFunction);
    expect(res.sendStatus).toBeCalledWith(401);
  });

  it("InternalServerError when the config doesn't have jwks_uri ", async () => {
    options.config.server.auth.idp!.jwksUri = "";
    const mockRequest = {
      app: {
        get: (key: keyof ServiceOptions) => options[key]
      },
      method: "GET"
    } as AuthRequest;
    
    authentication([])(mockRequest as AuthRequest, res as Response, nextFunction);
    expect(res.sendStatus).toBeCalledWith(500);    
  });
});