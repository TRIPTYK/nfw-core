import * as Express from "express";
import { BaseController } from "../controllers/base.controller";
import { MiddlewareMetadata, RouteDefinition } from "../decorators/controller.decorator";
import { ApplicationInterface } from "../interfaces/application.interface";
import { Constructor } from "../types/global";
export interface RouteContext {
    routeDefinition: RouteDefinition;
    controllerInstance: BaseController;
}
export declare abstract class BaseApplication implements ApplicationInterface {
    protected app: Express.Application;
    protected router: Express.Router;
    protected routes: Array<{
        prefix: string;
        type: "basic" | "generated" | "entity";
        routes: Array<RouteDefinition>;
    }>;
    constructor();
    setupMiddlewares(middlewaresForApp: MiddlewareMetadata[]): Promise<any>;
    abstract afterInit(): Promise<any>;
    init(): Promise<any>;
    get App(): Express.Application;
    get Routes(): {
        prefix: string;
        type: "basic" | "generated" | "entity";
        routes: RouteDefinition[];
    }[];
    listen(port: number): Promise<unknown>;
    /**
     * Setup controllers routing
     */
    setupControllers(controllers: Constructor<BaseController>[]): Promise<void>;
    private useMiddleware;
}
