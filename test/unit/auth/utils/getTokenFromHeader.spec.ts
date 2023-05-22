import { getTokenFromHeader } from "../../../../src/auth/utils";
import { Request } from "express";

describe("Unit Testing > Auth > getTokenFromHeader", () => {
  describe("Token retrieved successfully when Authorization header", () => {
    it("is a single string", () => {
      const mockedToken = "mock-token";
      const req = {
        get: (key: string) => {
          if (key == "Authorization") {
            return `Bearer ${mockedToken}`;
          }
        }
      } as Request;
      const result = getTokenFromHeader(req);

      expect(result).toEqual(mockedToken);
    });

    // TODO: This works only if the mockedToken is the first in the array
    // TODO: we need to handle this better in the code - future task
    it("is an arrya of strings", () => {
      const mockedToken = "mock-token";
      const req = {
        get: (key: string) => {
          if (key == "Authorization") {
            return [`Bearer ${mockedToken}`, "Bearer another-token"];
          }
        }
      } as Request;
      const result = getTokenFromHeader(req);

      expect(result).toEqual(mockedToken);
    });

    it("is a string without a Bearer prefix", () => {
      const mockedToken = "mock-token";
      const req = {
        get: (key: string) => {
          if (key == "Authorization") {
            return mockedToken;
          }
        }
      } as Request;
      const result = getTokenFromHeader(req);

      expect(result).toEqual(mockedToken);
    });
  });
  
  describe("Retrieves undefined when", () => {
    it("Authorization header is not provided", async () => {
      const req = {
        get: (key: string) => {
          if (key == "Authorization") {
            return undefined
          }
        }
      } as Request;
      const result = getTokenFromHeader(req);
      expect(result).toBeUndefined();
    })  
  });
});