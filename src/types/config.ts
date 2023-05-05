import { LogLevel } from "./logger";
import type { pino } from "pino";

interface LogConfiguration {
  /** Level of the logger (e.g. 'info') */
  level: LogLevel,
  /** 
   * Enable auto-logging. If set, the logger will 
   * automatically log the request and response
  */
  autoLogging: boolean,
}

interface ServerConfiguration {
  /** Port to bind on the server instance */
  port: number,
  auth: {
    /** Enable authentication */
    enabled: boolean,
    /** Identity Provider. If enabled is set to false,
     * this property should be ignored.
     */
    idp?: {
      /** Identity Provider JWKS Endpoint. */
      jwksUri: string,
    }
  },
  ignoreLogPaths?: string[],
  ignoreAuthPaths?: string[],
  
}

/**
 * External Service key-value map
 */
export interface ExternalService {
  /** key: service-name, value: service-URI */
  [key: string]: string,
}

export interface OpenAPIConfiguration {
  /** path to the OpenAPI file */
  path: string,
  /** enable middleware to validate the request payload */
  validateRequests: boolean,
  /** enable middleware to validate the response payload */
  validateResponses: boolean,
}


export interface ServiceConfiguration {
  /** 
   * API version; it is used by default in all the 
   * paths (`v${apiVersion}` resulting for example to /v1)
   */
  apiVersion: number,
  /** The name of the service */
  name: string,
  /** Logger configuration */
  log: LogConfiguration,
  /** Server configuration */
  server: ServerConfiguration,
  /** OpenAPI configuration */
  openAPI: OpenAPIConfiguration
  /** 
   * External Services configuration
   * This is used for service discovery.
   * (e.g. { "extServiceName": "https://extService.com" } )
   */
  externalServices?: ExternalService
}

export interface ServiceOptions {
  /** Pino Logger to inject in the Express app */
  logger: pino.Logger,
  /** Service Configuration */
  config: ServiceConfiguration,
}

