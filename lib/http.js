"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopServer = exports.startServer = exports.getHTTPServer = void 0;
const http_1 = __importDefault(require("http"));
const getHTTPServer = (app, name, logger) => {
    logger.info(`Starting ${name} service`);
    const server = http_1.default.createServer(app);
    return server;
};
exports.getHTTPServer = getHTTPServer;
const startServer = (server, port, logger) => {
    server.listen(port, () => {
        logger.info(`HTTP server is ready and listening at the ${port} port!`);
    });
};
exports.startServer = startServer;
const stopServer = (server, logger) => {
    logger.warn('HTTP server is shutting down');
    server.close();
};
exports.stopServer = stopServer;
