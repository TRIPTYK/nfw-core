import { autoInjectable, container } from "tsyringe";
import { BaseController, BaseErrorMiddleware } from "..";
import { getMetadataStorage, RequestMethods } from "../metadata/metadata-storage";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { BaseJsonApiModel } from "../models/json-api.model";
import { Constructor } from "../types/global";
import { ValidationSchema } from "../types/validation";


export interface MiddlewareMetadata {
    middleware: Constructor<BaseMiddleware>;
    args?: unknown;
}

export interface JsonApiMiddlewareMetadata extends MiddlewareMetadata {
    order: MiddlewareOrder;
}

export type MiddlewareOrder =
    | "afterValidation"
    | "beforeValidation"
    | "afterDeserialization"
    | "beforeDeserialization"
    | "beforeAll"
    | "afterAll";

/**
 *
 * @param routeName
 */
export function Controller(routeName: string) {
    return function <T extends Constructor<unknown>>(target: T): void {
        container.registerSingleton(target);
        autoInjectable()(target);
        getMetadataStorage().controllers.push({
            type : "classic",
            target : target,
            routeName: routeName
        })
    };
}

/**
 *
 * @param routeName
 */
export function GeneratedController(routeName: string) {
    return function <T extends Constructor<unknown>>(target: T): void {
        container.registerSingleton(target);
        getMetadataStorage().controllers.push({
            type : "classic",
            target : target,
            routeName: routeName,
            generated: true
        });
    };
}

export function JsonApiController(
    entity: Constructor<BaseJsonApiModel<unknown>>
) {
    return function <T extends Constructor<unknown>>(target: T): void {
        getMetadataStorage().controllers.push({
            type : "json-api",
            target : target,
            entity
        });
        container.registerSingleton(target);
    };
}

export interface UseMiddlewareDecoratorArgs<T = unknown> {
    priority?: number,
    args?: T,
}

export function RouteMiddleware<T = unknown>(
    middlewareClass: Constructor<BaseMiddleware | BaseErrorMiddleware>,
    options?: UseMiddlewareDecoratorArgs<T>
) {
    return function <T extends Constructor<BaseMiddleware | BaseErrorMiddleware>>(target: T): void {
        getMetadataStorage().useMiddlewares.push({
            target,
            middleware : middlewareClass, 
            level: "route",
            priority: options?.priority,
            args : options?.args,
            type: middlewareClass.constructor === BaseMiddleware ?  "classic" : "error"
        });
    };
}

export function MethodMiddleware<T = unknown>(
    middlewareClass: Constructor<BaseMiddleware>,
    options?: UseMiddlewareDecoratorArgs<T>
): MethodDecorator {
    return function (target: any, property: string): void {
        getMetadataStorage().useMiddlewares.push({
            target,
            middleware: middlewareClass,
            level: "route",
            property,
            priority: options?.priority ?? 0,
            args : options?.args,
            type: middlewareClass.constructor === BaseMiddleware ?  "classic" : "error"
        });
    };
}

export function JsonApiMethodMiddleware<T = unknown>(
    middlewareClass: Constructor<BaseMiddleware>,
    options?: UseMiddlewareDecoratorArgs<T>
): MethodDecorator {
    return function (target: any, property: string): void {
        getMetadataStorage().useMiddlewares.push({
            target,
            middleware: middlewareClass,
            level: "route",
            property,
            priority: options?.priority ?? 0,
            args : options?.args,
            type: middlewareClass.constructor === BaseMiddleware ?  "classic" : "error"
        });
    };
}

export function OverrideSerializer(schema = "default"): MethodDecorator {
    return function (target: any, propertyKey: string): void {
        
    };
}

export function OverrideValidator<T>(
    schema: ValidationSchema<T>
): MethodDecorator {
    return function (target: any, propertyKey: string): void {
        
    };
}

const registerMethod = (path: string = null, method: RequestMethods) =>
    function (target: Constructor<BaseController>, propertyKey: string): void {
        getMetadataStorage().controllerRoutes.push({
            property: propertyKey,
            path: path,
            target: target,
            method
        })
    };

export function Get(path: string): MethodDecorator {
    return registerMethod(path, "get");
}

export function Post(path: string): MethodDecorator {
    return registerMethod(path, "post");
}

export function Patch(path: string): MethodDecorator {
    return registerMethod(path, "patch");
}

export function Put(path: string): MethodDecorator {
    return registerMethod(path, "put");
}

export function Delete(path: string): MethodDecorator {
    return registerMethod(path, "delete");
}
