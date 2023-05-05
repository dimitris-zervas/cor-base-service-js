import { LogLevel } from './types/logger';
export declare function createLogger(name: string, level: LogLevel): import("pino").Logger<{
    name: string;
    level: LogLevel;
    redact: {
        paths: string[];
        remove: true;
    };
}>;
//# sourceMappingURL=logger.d.ts.map