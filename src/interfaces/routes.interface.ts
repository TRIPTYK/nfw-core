import { BaseController } from "../controllers";
import { RequestMethods } from "../decorators";

export interface RouteContext {
	routeDefinition: RouteDefinition;
	controllerInstance: BaseController;
}

export interface GlobalRouteDefinition {
    prefix: string;
    type: "basic" | "generated" | "entity";
    routes: RouteDefinition[];
}

export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}