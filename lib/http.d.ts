import http from 'http';
import type { Application } from 'express';
import type { Logger } from 'pino';
export declare const getHTTPServer: (app: Application, name: string, logger: Logger) => http.Server;
export declare const startServer: (server: http.Server, port: number, logger: Logger) => void;
export declare const stopServer: (server: http.Server, logger: Logger) => void;
//# sourceMappingURL=http.d.ts.map