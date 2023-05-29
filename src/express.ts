import express from "express";
import { IncomingMessage } from "http";
import { OpenAPIConfiguration, ServiceOptions } from "./types/config";
import { Router } from "./router";
import { authentication } from "./auth/http";
import { StatusCodes } from "http-status-codes";
import { HttpLogger, pinoHttp, Options as pinoOptions } from "pino-http";
import { middleware as openApiMiddleware } from "express-openapi-validator";
import { realpathSync } from "fs";
import listEndpoints from "express-list-endpoints";
import { pino } from "pino";


const buildIgnorePaths = (paths: string[], version: number): string[] => {
  const ignorePaths: string[] = [];
  ignorePaths.push("/healthcheck");
  ignorePaths.push(...paths.map((path) => `/v${version}${path}`));
  return ignorePaths;
}

const getPinoHttp = (enabled: boolean, ignorePaths: string[], logger: pino.Logger): HttpLogger => {
  const options: pinoOptions = {
    logger: logger,
    autoLogging: { ignore: (req: IncomingMessage) => {
      if (!enabled) {
        // ? true to ignore, hence false to autologging.
        return true;
      } else {
        if (req.url) {
          if (ignorePaths.includes(req.url)) {
            return true;
          }
        }
        return false;
      }
    }}
  }
  return pinoHttp(options)
}

const getOpenAPIValidator = (logger: pino.Logger, config: OpenAPIConfiguration) => {
  try {
    realpathSync(config.path);
  } catch(err) {
    logger.error("OpenAPI spec file not found");
    process.exit(1);
  }
  logger.info(`Using OpenAIP spec file: ${config.path}`);
  return openApiMiddleware({
    apiSpec: config.path,
    validateRequests: config.validateRequests,
    validateResponses: config.validateResponses
  });
}

const get404Handler = (): express.Handler => {
  return (req: express.Request, res: express.Response): void => {
    res.status(StatusCodes.NOT_FOUND).json({ message: `URL not found: ${req.path}` });
  }
}

// Express error handler
const getErrorHandler = () => {
  return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const logger = req.app.get("logger");
    // TODO: remove this logger when we are confident the handler handles all type of errors
    logger.warn({error: err}, "Error handler middleware");
    res.status(err.status || err.code || 500).json({
      message: err.message,
      type: err.type,
      path: err.path
    });
    next();
  }
}

const printEndpoints = (app: express.Express, logger: pino.Logger) => {
  const endpoints = listEndpoints(app)
  for (const endpoint of endpoints) {
    logger.info({ methods: endpoint.methods, path: endpoint.path })
  }
}

export const createExpressApp = (options: ServiceOptions, router?: Router, healthz: express.Handler = (_, res) => res.sendStatus(StatusCodes.OK)): express.Application => {
  const app = express();
  const { logger, config } = options;

  // Set helper settings
  app.set("logger", logger);
  app.set("config", config);

  // Content-Types
  app.use(express.json());
  app.use(express.text());

  // Set up and configure the logger
  const ignoreLogPaths = buildIgnorePaths(config.server.ignoreLogPaths ? config.server.ignoreLogPaths : [], config.apiVersion);
  logger.debug({ paths: ignoreLogPaths }, "Paths to not log requests from");
  app.use(getPinoHttp(config.log.autoLogging, ignoreLogPaths, logger));

  // Configure authentication
  const ignoreAuthPaths = buildIgnorePaths(config.server.ignoreAuthPaths ? config.server.ignoreAuthPaths : [], config.apiVersion);
  logger.debug({ paths: ignoreAuthPaths }, "Paths to not enforce authentication");
  app.set("authentication", config.server.auth.enabled);
  if (config.server.auth.enabled) {
    app.use(authentication(ignoreAuthPaths));
    logger.info("Authentication enforced on all handlers");
  }

  // OpenAPI
  if (config.openAPI.path && config.openAPI.path !== "") {
    app.use(getOpenAPIValidator(logger, config.openAPI));
  }

  // Healthcheck endpoint
  app.get("/healthcheck", healthz);

  // Routes
  if (router) {
    const routerPath = router.path !== "" ? `/${router.path}` : "";
    app.use(`${routerPath}`, router.getRouter());
  }

  // Error handlers
  app.use(get404Handler());
  app.use(getErrorHandler());

  // Log all the endpoints
  printEndpoints(app, logger);

  return app;
}