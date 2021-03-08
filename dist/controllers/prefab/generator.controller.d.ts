/// <reference types="socket.io-client" />
import { Request, Response } from "express";
import { BaseController } from "../base.controller";
/**
 * Generates app
 */
export declare class GeneratorController extends BaseController {
    socket: SocketIOClient.Socket;
    generateRoute(req: Request, res: Response): Promise<void>;
    generateSubRoute(req: Request, res: Response): Promise<void>;
    generateEntity(req: Request, res: Response): Promise<void>;
    addPermissions(req: Request, res: Response): Promise<void>;
    addEntityRelation(req: Request, res: Response): Promise<void>;
    generateColumn(req: Request, res: Response): Promise<void>;
    do(req: Request, res: Response): Promise<void>;
    deleteRoute(req: Request, res: Response): Promise<void>;
    deleteSubRoute(req: Request, res: Response): Promise<void>;
    deleteEntityColumn(req: Request, res: Response): Promise<void>;
    deleteEntityRelation(req: Request, res: Response): Promise<void>;
    deleteEntity(req: Request, res: Response): Promise<void>;
    modSubRoute(req: Request, res: Response): Promise<void>;
    constructor();
    private sendMessageAndWaitResponse;
}
