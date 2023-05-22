import * as auth from "../../../../src/auth/utils";
import { createLogger } from "../../../../src/logger";
import { InternalServerError } from "../../../../src/errors";
import { getMockedToken } from "../../../fixtures/mockToken";
import { mocked } from "jest-mock";


jest.mock("jsonwebtoken");
/* tslint:disable no-var-requires */
const jwt = require("jsonwebtoken");

const logger = createLogger("test-logger", "silent");

const mockedDecodedToken = getMockedToken();

describe("Unit Testing > Auth > verifyJWT", () => {

  describe("It throws an error when", () => {
    it("the getSigningKey call throws an error", async () => {
      // Mock the getSigningKey
      jest.spyOn(auth, "getSigningKey").mockRejectedValue(InternalServerError());
      // Make the function call
      await auth.verifyJWT("idp", "token", logger).catch(error => {
        expect(error.status).toEqual(500);
        expect(error.message).toEqual("Internal Server Error");
      });
    });
  });

  describe("It returns", () => {
    it("the decoded payload", async () => {
      // Mock the getSigningKey
      jest.spyOn(auth, "getSigningKey").mockResolvedValue("public-key");
      // Mock the jwt.verify
      mocked(jwt).verify = jest.fn().mockReturnValue(mockedDecodedToken.payload);
      // Call the function
      await auth.verifyJWT("idp", "token", logger).then(payload => {
        expect(payload).toHaveProperty("iss");
        expect(payload).toHaveProperty("iat");
        expect(payload).toHaveProperty("nbf");
      });
    });
  });
  
});

