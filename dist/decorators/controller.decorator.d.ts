import { BaseMiddleware } from "../middlewares/base.middleware";
import { JsonApiModel } from "../models/json-api.model";
import { Constructor } from "../types/global";
import { ValidationSchema } from "../types/validation";
export declare type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";
export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}
export interface MiddlewareMetadata {
    middleware: Constructor<BaseMiddleware>;
    args?: any;
}
export interface JsonApiMiddlewareMetadata extends MiddlewareMetadata {
    order: MiddlewareOrder;
}
export declare type MiddlewareOrder = "afterValidation" | "beforeValidation" | "afterDeserialization" | "beforeDeserialization" | "beforeAll" | "afterAll";
/**
 *
 * @param routeName
 */
export declare function Controller(routeName: string): ClassDecorator;
/**
 *
 * @param routeName
 */
export declare function GeneratedController(routeName: string): ClassDecorator;
/**
 *
 * @param entity
 */
export declare function JsonApiController<T extends JsonApiModel<T>>(entity: Constructor<T>): ClassDecorator;
export declare function RouteMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T): ClassDecorator;
export declare function MethodMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T): MethodDecorator;
export declare function JsonApiMethodMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T, order?: MiddlewareOrder): MethodDecorator;
export declare function OverrideSerializer(schema?: string): MethodDecorator;
export declare function OverrideValidator<T>(schema: ValidationSchema<T>): MethodDecorator;
export declare function Get(path?: string): MethodDecorator;
export declare function Post(path?: string): MethodDecorator;
export declare function Patch(path?: string): MethodDecorator;
export declare function Put(path?: string): MethodDecorator;
export declare function Delete(path?: string): MethodDecorator;
