import { NextFunction, Request, Response } from "express";
import { autoInjectable, container } from "tsyringe";
import { BaseController, BaseErrorMiddleware } from "..";
import { GuardInterface } from "../interfaces/guard.interface";
import { ResponseHandlerInterface } from "../interfaces/response-handler.interface";
import { getMetadataStorage, RequestMethods } from "../metadata/metadata-storage";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { BaseJsonApiModel } from "../models/json-api.model";
import { Constructor } from "../types/global";

export interface MiddlewareMetadata {
    middleware: Constructor<BaseMiddleware>;
    args?: unknown;
}

/**
 *
 * @param routeName
 */
export function Controller(routeName: string) {
    return function <T extends Constructor<unknown>>(target: T): void {
        autoInjectable()(target);
        container.isRegistered(target);
        container.registerSingleton(target);
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
 export function UseGuard(guard: Constructor<GuardInterface>, args?: unknown) {
    return function <T extends Constructor<BaseController>>(target: T, property?: string): void {
        getMetadataStorage().useGuards.push({
            target : target,
            guard,
            args,
            propertyName : property
        })
    };
}

/**
 *
 * @param routeName
 */
 export function UseResponseHandler(responseHandler: Constructor<ResponseHandlerInterface>, args?: unknown) {
    return function <T extends Constructor<BaseController>>(target: T, property?: string): void {
        getMetadataStorage().useResponseHandlers.push({
            target : target,
            responseHandler,
            args,
            propertyName : property
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

export function UseMiddleware<T = unknown>(
    middlewareClass: Constructor<BaseMiddleware | BaseErrorMiddleware> | ((req: Request,res: Response,next: NextFunction) => unknown),
    options?: UseMiddlewareDecoratorArgs<T>
) {
    return function(target: any, property?: string): void {
        getMetadataStorage().useMiddlewares.push({
            target,
            middleware : middlewareClass, 
            level: property ? "route" : "controller",
            priority: options?.priority,
            property,
            args : options?.args
        });
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
