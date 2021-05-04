import * as Express from "express";
import { BaseController } from "../controllers/base.controller";
import { MiddlewareMetadata } from "../decorators/controller.decorator";
import { ApplicationInterface } from "../interfaces/application.interface";
import { GlobalRouteDefinition } from "../interfaces/routes.interface";
import { Constructor } from "../types/global";
export declare abstract class BaseApplication implements ApplicationInterface {
    protected app: Express.Application;
    protected router: Express.Router;
    protected routes: GlobalRouteDefinition[];
    constructor();
    setupMiddlewares(middlewaresForApp: MiddlewareMetadata[]): Promise<any>;
    abstract afterInit(): Promise<any>;
    init(): Promise<any>;
    get App(): Express.Application;
    get Routes(): GlobalRouteDefinition[];
    listen(port: number): Promise<unknown>;
    /**
     * Setup controllers routing
     */
    setupControllers(controllers: Constructor<BaseController>[]): Promise<void>;
    private useMiddleware;
}
