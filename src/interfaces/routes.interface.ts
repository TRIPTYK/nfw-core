import { BaseController } from "../controllers";
import { RequestMethods } from "../decorators";

export interface RouteContext {
	routeDefinition: RouteDefinition;
	controllerInstance: BaseController;
}

export interface GlobalRouteDefinition {
	prefix: string;
	type: routeType;
	routes: RouteDefinition[];
}

export interface RouteDefinition {
	path: string;
	requestMethod: RequestMethods;
	methodName: string;
}

export type routeType = "basic" | "generated" | "entity";
export type reqestType =
	| "get"
	| "post"
	| "delete"
	| "options"
	| "put"
	| "patch";
