"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
function createLogger(name, level) {
    return (0, pino_1.default)({
        name,
        level,
        redact: {
            paths: ['req.headers.authorization'],
            remove: true
        }
    });
}
exports.createLogger = createLogger;
