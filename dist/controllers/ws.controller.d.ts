/// <reference types="socket.io-client" />
import { BaseController } from "./base.controller";
/**
 * BaseController that handles WebSocket connection.
 */
export declare class WsController extends BaseController {
    socket: SocketIOClient.Socket;
    /**
     * @param address Address of the WS server to connect.
     * @param onConnect Function executed on connection.
     * @param callback Function executed when the application registry is running.
     */
    constructor(address: string, onConnect?: () => void, callback?: () => void);
    /**
     * Send a message to the server and wait for a response.
     * @param type Type of request.
     * @param data Complement data to send.
     * @returns Promise of the response as a string.
     */
    protected sendMessageAndWaitResponse(type: string, data?: any): Promise<string>;
}
