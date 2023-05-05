import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { ResponseError } from './types/errors';


/** 400 Bad Request */
export const BadRequestError = (message?: string) : ResponseError => {
  return {
    status: StatusCodes.BAD_REQUEST,
    message: message || ReasonPhrases.BAD_REQUEST
  }
}

/** 401 Unauthorized */
export const UnauthorizedError = (message?: string): ResponseError => {
  return {
    status: StatusCodes.UNAUTHORIZED,
    message: message || ReasonPhrases.UNAUTHORIZED
  }
}

/** 403 Forbidden */
export const ForbiddenError = (message?: string) : ResponseError => {
  return {
    status: StatusCodes.FORBIDDEN,
    message: message || ReasonPhrases.FORBIDDEN
  }
};

/** 404 Not Found */
export const NotFoundError = (message?: string) : ResponseError => {
  return {
    status: StatusCodes.NOT_FOUND,
    message: message || ReasonPhrases.NOT_FOUND
  }
}

/** 500 Internal Server Error */
export const InternalServerError = (message?: string): ResponseError => {
  return {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: message || ReasonPhrases.INTERNAL_SERVER_ERROR
  }
}

/** 502 Bad Gateway */
export const BadGateWayError = (message?: string) : ResponseError => {
  return {
    status: StatusCodes.BAD_GATEWAY,
    message: message || ReasonPhrases.BAD_GATEWAY
  }
}

/** 504 Gateway Timeout */
export const GateWayTimeout = (message?: string) : ResponseError => {
  return {
    status: StatusCodes.GATEWAY_TIMEOUT,
    message: message || ReasonPhrases.GATEWAY_TIMEOUT
  }
}

