"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressApp = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("./auth/http");
const http_status_codes_1 = require("http-status-codes");
const pino_http_1 = require("pino-http");
const express_openapi_validator_1 = require("express-openapi-validator");
const fs_1 = require("fs");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const buildIgnorePaths = (paths, version) => {
    const ignorePaths = [];
    ignorePaths.push('/healthcheck');
    ignorePaths.push(...paths.map((path) => `/v${version}${path}`));
    return ignorePaths;
};
const getPinoHttp = (enabled, ignorePaths, logger) => {
    const options = {
        logger: logger,
        autoLogging: { ignore: (req) => {
                if (!enabled) {
                    return true;
                }
                else {
                    if (req.url) {
                        if (ignorePaths.includes(req.url)) {
                            return true;
                        }
                    }
                    return false;
                }
            } }
        // autoLogging: { ignore: (req: IncomingMessage) => {
        //   if (!enabled) {
        //     console.log("ep ep");
        //     return false;
        //   }
        //   console.log("op op", enabled);
        //   if (req.url) {
        //     if (ignorePaths.includes(req.url)) {
        //       return true
        //     }
        //   }
        //   return false
        // }, }
    };
    return (0, pino_http_1.pinoHttp)(options);
};
const getOpenAPIValidator = (logger, config) => {
    try {
        (0, fs_1.realpathSync)(config.path);
    }
    catch (err) {
        logger.error('OpenAPI spec file not found');
        process.exit(1);
    }
    logger.info(`Using OpenAIP spec file: ${config.path}`);
    return (0, express_openapi_validator_1.middleware)({
        apiSpec: config.path,
        validateRequests: config.validateRequests,
        validateResponses: config.validateResponses
    });
};
const get404Handler = () => {
    return (req, res) => {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: `URL not found: ${req.path}` });
    };
};
// Express error handler
const getErrorHandler = () => {
    return (err, req, res, next) => {
        // TODO: remove this logger when we are confident the handler handles all type of errors
        const logger = req.app.get('logger');
        logger.warn({ error: err }, "Error handler middleware");
        res.status(err.status || err.code || 500).json({
            message: err.message,
            type: err.type,
            path: err.path
        });
        next();
    };
};
const printEndpoints = (app, logger) => {
    const endpoints = (0, express_list_endpoints_1.default)(app);
    for (const endpoint of endpoints) {
        logger.info({ methods: endpoint.methods, path: endpoint.path });
    }
};
const createExpressApp = (options, router, healthz = (_, res) => res.sendStatus(http_status_codes_1.StatusCodes.OK)) => {
    const app = (0, express_1.default)();
    const { logger, config } = options;
    // Set helper settings
    app.set('logger', logger);
    app.set('config', config);
    // Content-Types
    app.use(express_1.default.json());
    app.use(express_1.default.text());
    // Set up and configure the logger
    const ignoreLogPaths = buildIgnorePaths(config.server.ignoreLogPaths ? config.server.ignoreLogPaths : [], config.apiVersion);
    logger.debug({ paths: ignoreLogPaths }, 'Paths to not log requests from');
    app.use(getPinoHttp(config.log.autoLogging, ignoreLogPaths, logger));
    // Configure authentication
    const ignoreAuthPaths = buildIgnorePaths(config.server.ignoreAuthPaths ? config.server.ignoreAuthPaths : [], config.apiVersion);
    logger.debug({ paths: ignoreAuthPaths }, 'Paths to not enforce authentication');
    app.set('authentication', config.server.auth.enabled);
    if (config.server.auth.enabled) {
        app.use((0, http_1.authentication)(ignoreAuthPaths));
        logger.info('Authentication enforced on all handlers');
    }
    // OpenAPI
    if (config.openAPI.path && config.openAPI.path !== "") {
        app.use(getOpenAPIValidator(logger, config.openAPI));
    }
    // Healthcheck endpoint
    app.get('/healthcheck', healthz);
    // Routes
    if (router) {
        const routerPath = router.path !== '' ? `/${router.path}` : '';
        app.use(`/v${config.apiVersion}${routerPath}`, router.getRouter());
    }
    // Error handlers
    app.use(get404Handler());
    app.use(getErrorHandler());
    // Log all the endpoints
    printEndpoints(app, logger);
    return app;
};
exports.createExpressApp = createExpressApp;
