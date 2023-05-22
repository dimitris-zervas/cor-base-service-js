import express from "express";
// import {StatusCodes } from "http-status-codes";
import { createExpressApp } from "../../src/express";
import { Router } from "../../src/router";
import type { Logger } from "../../src/types/logger";
import type { ServiceOptions, OpenAPIConfiguration } from "../../src/types/config";
import { createLogger } from "../../src";

describe("createExpressApp", () => {
  let options: ServiceOptions;
  let router: Router;
  let logger: Logger;

  beforeEach(() => {
    options = {
      logger: createLogger("test-logger", "silent"),
      config: {
        server: {
          ignoreLogPaths: [],
          ignoreAuthPaths: [],
          auth: {
            enabled: false,
          },
          port: 8008,
        },
        apiVersion: 1,
        log: {
          autoLogging: false,
          level: "silent",
        },
        openAPI: {} as OpenAPIConfiguration,
        name: "test-service",
      }
    };

    router = {
      path: "",
      getRouter: jest.fn(() => {
        // Mocking the middleware function
        return jest.fn() as unknown as express.Handler;
      }),
    } as unknown as Router;

    logger = options.logger;
  });

  it("should create an Express app with the provided options", () => {
    const app = createExpressApp(options, router);
    expect(app.get("logger")).toBe(logger);
    expect(app.get("config")).toBe(options.config);
    expect(app._router.stack.length).toBeGreaterThan(0);
  });
});
