import express from 'express';
import asyncHandler from 'express-async-handler';


export class Router {
  private router: express.Router;
  public path: string;

  constructor(path: string) {
    this.router = express.Router({ mergeParams: true });
    this.path = path;
  }

  public addGetHandler(path: string, handler: express.Handler) {
    this.router.get(path, asyncHandler(handler));
  }

  public addPostHandler(path: string, handler: express.Handler) {
    this.router.post(path, asyncHandler(handler));
  }

  public addDeleteHandler(path: string, handler: express.Handler) {
    this.router.delete(path, asyncHandler(handler));
  }

  public addPutHanlder(path: string, handler: express.Handler) {
    this.router.put(path, asyncHandler(handler));
  }

  public addPatchHandler(path: string, handler: express.Handler) {
    this.router.patch(path, asyncHandler(handler));
  }


  public getRouter(): express.Router {
    return this.router;
  }
}