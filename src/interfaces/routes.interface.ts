import { BaseController } from "../controllers";
import { ControllerRoutesMetadataArgs, RequestMethods } from "../metadata/metadata-storage";

export interface RouteContext {
	routeMeta: ControllerRoutesMetadataArgs;
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

export type requestType =
	| "get"
	| "post"
	| "delete"
	| "options"
	| "put"
	| "patch";
