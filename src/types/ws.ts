import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { TokenPayload, UserIdPayload } from "./token";


export type WSHandler = (wss: WebSocketServer, req: IncomingMessage, ws: WebSocket, token: TokenPayload | UserIdPayload) => void;

export interface WSRoute {
  path: string,
  handler: WSHandler
}