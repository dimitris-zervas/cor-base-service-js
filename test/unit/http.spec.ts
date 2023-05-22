import { getHTTPServer, startServer, stopServer } from "../../src/http";
import { Application } from "express";
import { Logger } from "../../src/types/logger";
import http from "http";
import { createLogger } from "../../src";

describe("getHTTPServer", () => {
  let app: Application;
  let logger: Logger;

  beforeEach(() => {
    app = jest.fn() as unknown as Application;
    logger = createLogger("test-logger", "silent");
  });

  it("should create an HTTP server with the provided app", () => {
    const server = getHTTPServer(app, "Test Server", logger);
    expect(server).toBeInstanceOf(http.Server);
  });
});

describe("startServer", () => {
  let server: http.Server;
  let logger: Logger;

  beforeEach(() => {
    server = {
      listen: jest.fn()
    } as unknown as http.Server;
    logger = {
      info: jest.fn()
    } as unknown as Logger;
  });

  it("should start the server and log the appropriate message", () => {
    const port = 8080;
    startServer(server, port, logger);
    expect(server.listen).toHaveBeenCalledWith(port, expect.any(Function));
  });
});


describe("stopServer", () => {
  let server: http.Server;
  let logger: Logger;

  beforeEach(() => {
    server = {
      close: jest.fn()
    } as unknown as http.Server;
    logger = {
      warn: jest.fn()
    } as unknown as Logger;
  });

  it("should stop the server and log the appropriate message", () => {
    stopServer(server, logger);
    expect(server.close).toHaveBeenCalled();
  });
});

