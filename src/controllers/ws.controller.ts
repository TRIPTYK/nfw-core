import { BaseController } from "./base.controller";
import { Socket, io  } from "socket.io-client";
import { ApplicationLifeCycleEvent, ApplicationRegistry } from "../application/registry.application";

/**
 * BaseController that handles WebSocket connection.
 */
export class WsController extends BaseController {
    public socket: Socket  = null;

    /**
     * @param address Address of the WS server to connect.
     * @param onConnect Function executed on connection.
     * @param callback Function executed when the application registry is running.
     */
    constructor(
        address: string, 
        onConnect = () => {},
        callback = () => {}
        ) {
		super();
		this.socket = io(address, {
			query: {
				app: "false",
			},
		});
		ApplicationRegistry.on(ApplicationLifeCycleEvent.Running, () => {
			this.socket.on("connect", onConnect);
            callback();
		});
	}
    
    /**
     * Send a message to the server and wait for a response.
     * @param type Type of request.
     * @param data Complement data to send.
     * @returns Promise of the response as a string.
     */
    protected sendMessageAndWaitResponse(type: string, data?: any): Promise<string> {
		return new Promise((resolve, rej) => {
			this.socket.emit(type, data, (response: string) => {
				console.log(`[${type}]:\t${response}`);
				if (response === "ok") {
					resolve(response);
				} else {
					rej(response);
				}
			});
		});
	}
}