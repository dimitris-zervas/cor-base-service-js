import { WebSocketServer } from "ws";
import { IncomingMessage, Server } from "http";
import { Duplex } from "stream";
import { WSRoute } from "./types/ws";
import { ResponseError } from "./types/errors";
import { ServiceOptions } from "./types/config";
import { UserIdPayload, TokenPayload } from "./types/token";
import { NotFoundError } from "./errors";
import { socketAuthentication } from "./auth/ws";
import { getTokenFromWebSocket } from "./auth/utils";
import jwt from "jsonwebtoken";

const sendErrorAndDestory = (socket: Duplex, error: ResponseError, options: ServiceOptions) => {
    options.logger.error({ error }, "Error on the upgrade signal");
    socket.write(`HTTP/1.1 ${error.status} ${error.message}\r\n\r\n`);
    socket.destroy();
}


export const attachWebSocketServer = (server: Server, options: ServiceOptions, router: WSRoute[]) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const location = new URL(req.url as string, `http://${req.headers.host}`);
    const path = location.pathname;
    const matchRoute = router.find(route => route.path === path);
    if (matchRoute) {
      /* If authenticated */
      let token: TokenPayload | UserIdPayload | undefined;
      if (options.config.server.auth.enabled) {
        try {
          token = await socketAuthentication(req, options.config, options.logger);
        } catch (error: any) {
          sendErrorAndDestory(socket, error, options);
          return;
        }
      } else {
        const oid = location.searchParams.get("oid");
        if (!oid) {
          const err: ResponseError = { status: 400, message: "Missing user id"}
          sendErrorAndDestory(socket, err, options);
          return;
        }
        token = { oid } as UserIdPayload; 
      }
      /* Upgrade the conncetion */
      wss.handleUpgrade(req, socket, head, (ws, req) => {
        matchRoute.handler(wss, req, ws, token as TokenPayload | UserIdPayload);
        wss.emit("connection", ws, req, token);
      })
    } else {
      sendErrorAndDestory(socket, NotFoundError(), options);
    }
  });
}

export const attachTestWebSocketServer = (server: Server, options: ServiceOptions, router: WSRoute[]) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const location = new URL(req.url as string, `http://${req.headers.host}`);
    const path = location.pathname;
    const matchRoute = router.find(route => route.path === path);
    if (matchRoute) {
      /* This is for testing so auth or no auth we upgrade with the decoded token */
      let token: TokenPayload | undefined;
      const encoded = getTokenFromWebSocket(req, options.logger);
      token = jwt.decode(encoded as string) as TokenPayload;
      /* Upgrade the conncetion */
      wss.handleUpgrade(req, socket, head, (ws, req) => {
        matchRoute.handler(wss, req, ws, token as TokenPayload);
        wss.emit("connection", ws, req, token);
      })
    } else {
      sendErrorAndDestory(socket, NotFoundError(), options);
    }
  });
}