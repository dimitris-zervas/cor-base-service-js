import { getSigningKey } from "../../../../src/auth/utils";
import {  getMockedToken } from "../../../fixtures/mockToken";
import { UnauthorizedError } from "../../../../src/errors";
import { createLogger } from "../../../../src/logger";

jest.mock("jwt-decode");
/* tslint:disable no-var-requires */
const mockedDecode = require("jwt-decode");

const logger = createLogger("test-logger", "silent");

describe("Unit Testing > Auth > getSigningKey", () => {
  describe("It throws an error when", () => {
    it("the decoded token is malformed", () => {
      mockedDecode.mockImplementation(() => {throw UnauthorizedError()});
      getSigningKey("idp_uri", "token", logger).catch(error => {
        expect(error.status).toEqual(401);
        expect(error.message).toEqual("Unauthorized");
      });
    });

    it("the call to the IDP client throws an error", async () => {
      mockedDecode.mockImplementation(async () => getMockedToken());
      
      await getSigningKey("idp_uri", "token", logger).catch(error => {
        expect(error.status).toEqual(500);
        expect(error.message).toEqual("Internal Server Error");
      });
    });
  });
});