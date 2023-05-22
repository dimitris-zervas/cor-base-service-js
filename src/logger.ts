import pino from "pino";
import { LogLevel } from "./types/logger";

export function createLogger(name: string, level: LogLevel) {
  return pino({
    name,
    level,
    redact: {
      paths: ["req.headers.authorization"],
      remove: true
    }
  });
}

