import express from 'express';
export declare class Router {
    private router;
    path: string;
    constructor(path: string);
    addGetHandler(path: string, handler: express.Handler): void;
    addPostHandler(path: string, handler: express.Handler): void;
    addDeleteHandler(path: string, handler: express.Handler): void;
    addPutHanlder(path: string, handler: express.Handler): void;
    addPatchHandler(path: string, handler: express.Handler): void;
    getRouter(): express.Router;
}
//# sourceMappingURL=router.d.ts.map