"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsController = void 0;
const base_controller_1 = require("./base.controller");
const SocketIO = require("socket.io-client");
const registry_application_1 = require("../application/registry.application");
/**
 * BaseController that handles WebSocket connection.
 */
class WsController extends base_controller_1.BaseController {
    /**
     * @param address Address of the WS server to connect.
     * @param onConnect Function executed on connection.
     * @param callback Function executed when the application registry is running.
     */
    constructor(address, onConnect = () => { }, callback = () => { }) {
        super();
        this.socket = null;
        this.socket = SocketIO(address, {
            query: {
                app: false,
            },
        });
        registry_application_1.ApplicationRegistry.on(registry_application_1.ApplicationLifeCycleEvent.Running, () => {
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
    sendMessageAndWaitResponse(type, data) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                console.log(`[${type}]:\t${response}`);
                if (response === "ok") {
                    resolve(response);
                }
                else {
                    rej(response);
                }
            });
        });
    }
}
exports.WsController = WsController;
