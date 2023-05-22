import {
  BadGateWayError,
  BadRequestError,
  ForbiddenError,
  GateWayTimeout,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from "../../src/errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

describe("Unit Testing > Errors", () => {
  const errorMessage = "beep";

  it("should return a BadRequestError when a valid string is passed", () => {
    const error = BadRequestError(errorMessage);
    expect(error.message).toEqual(errorMessage);
    expect(error.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it("should return the default message of BadRequest error, when no string is given as parameter", () => {
    const error = BadRequestError();
    expect(error.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(error.message).toEqual(ReasonPhrases.BAD_REQUEST);
  });

  it("should return the default message of NOT_FOUND error, when no string is given as parameter", () => {
    const error = NotFoundError();
    expect(error.status).toEqual(StatusCodes.NOT_FOUND);
    expect(error.message).toEqual(ReasonPhrases.NOT_FOUND);
  });
  
  it("should return an InternalServer error when a valid string is passed", () => {
    const error = InternalServerError(errorMessage);
    expect(error.message).toEqual(errorMessage);
    expect(error.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it("should return the default message of InternalServer error, when no string is given as parameter", () => {
    const error = InternalServerError();
    expect(error.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(error.message).toEqual(ReasonPhrases.INTERNAL_SERVER_ERROR);
  });
  
  it("should return the default message of Unauthorized error, when no string is given as parameter", () => {
    const error = UnauthorizedError();
    expect(error.status).toEqual(StatusCodes.UNAUTHORIZED);
    expect(error.message).toEqual(ReasonPhrases.UNAUTHORIZED);
  });


  it("should return the default message of GateWayTimeout error, when no string is given as parameter", () => {
    const error = GateWayTimeout();
    expect(error.status).toEqual(StatusCodes.GATEWAY_TIMEOUT);
    expect(error.message).toEqual(ReasonPhrases.GATEWAY_TIMEOUT);
  });

  it("should return the default message of ForbiddenError error, when no string is given as parameter", () => {
    const error = ForbiddenError();
    expect(error.status).toEqual(StatusCodes.FORBIDDEN);
    expect(error.message).toEqual(ReasonPhrases.FORBIDDEN);
  });
  
  it("should return the default message of BadGateWayError error, when no string is given as parameter", () => {
    const error = BadGateWayError();
    expect(error.status).toEqual(StatusCodes.BAD_GATEWAY);
    expect(error.message).toEqual(ReasonPhrases.BAD_GATEWAY);
  });
});
