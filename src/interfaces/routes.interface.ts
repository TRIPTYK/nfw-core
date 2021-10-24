import { Request, Response } from "express";
import { RequestMethods } from "../metadata/metadata-storage";

export interface GuardContext<T> {
	request: Request;
	method: string;
	controller: T;
	args?: unknown;
}

export interface ResponseHandlerContext<T> {
	response: Response;
	method: string;
	controller: T;
	args?: unknown;
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
