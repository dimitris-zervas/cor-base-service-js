import http from "http";
import type { Application } from "express";
import type { Logger } from "pino";

export const getHTTPServer = (app: Application, name: string, logger: Logger): http.Server => {
  logger.info(`Starting ${name} service`);
  const server = http.createServer(app);

  return server;
}

export const startServer = (server: http.Server, port: number, logger: Logger) => {
  server.listen(port, () => {
    logger.info(`HTTP server is ready and listening at the ${port} port!`);
  });
}

export const stopServer = (server: http.Server, logger: Logger) => {
  logger.warn("HTTP server is shutting down");
  server.close();
}