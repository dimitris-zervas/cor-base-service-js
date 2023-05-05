"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class Router {
    router;
    path;
    constructor(path) {
        this.router = express_1.default.Router({ mergeParams: true });
        this.path = path;
    }
    addGetHandler(path, handler) {
        this.router.get(path, (0, express_async_handler_1.default)(handler));
    }
    addPostHandler(path, handler) {
        this.router.post(path, (0, express_async_handler_1.default)(handler));
    }
    addDeleteHandler(path, handler) {
        this.router.delete(path, (0, express_async_handler_1.default)(handler));
    }
    addPutHanlder(path, handler) {
        this.router.put(path, (0, express_async_handler_1.default)(handler));
    }
    addPatchHandler(path, handler) {
        this.router.patch(path, (0, express_async_handler_1.default)(handler));
    }
    getRouter() {
        return this.router;
    }
}
exports.Router = Router;
