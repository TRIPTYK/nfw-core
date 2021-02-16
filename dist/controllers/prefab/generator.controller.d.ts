/// <reference types="socket.io-client" />
import { Request, Response } from "express";
import { BaseController } from "../base.controller";
/**
 * Generates app
 */
export declare class GeneratorController extends BaseController {
    socket: SocketIOClient.Socket;
    generateEntity(req: Request, res: Response): Promise<void>;
    addEntityRelation(req: Request, res: Response): Promise<void>;
    generateColumn(req: Request, res: Response): Promise<void>;
    do(req: Request, res: Response): Promise<void>;
    deleteEntityColumn(req: Request, res: Response): Promise<void>;
    deleteEntityRelation(req: Request, res: Response): Promise<void>;
    deleteEntity(req: Request, res: Response): Promise<void>;
    constructor();
    private sendMessageAndWaitResponse;
}
