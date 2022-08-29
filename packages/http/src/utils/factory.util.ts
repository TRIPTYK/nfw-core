import type { Middleware, RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { container } from 'tsyringe';
import type { ControllerContextInterface } from '../interfaces/controller-context.interface.js';
import type { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js';
import type { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import type { ControllerParamsContext, UseParamsMetadataArgs } from '../storages/metadata/use-param.metadata.js';
import isClass from 'is-class';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function applyParam (paramMetadata: UseParamsMetadataArgs, ctx: ControllerParamsContext) {
  /**
   * Args is a special handler, it should be handled before in guard or response-handler
   */
  if (paramMetadata.handle === 'args') {
    throw new Error("Args are not handled in this context, please don't use this decorator in this context");
  }

  /**
   * Return without args, it has his own decorator
   */
  if (paramMetadata.handle === 'controller-context') {
    return {
      controllerAction: ctx.controllerAction,
      controllerInstance: ctx.controllerInstance
    } as ControllerContextInterface;
  }

  /**
   * Handle the rest normally
   */
  return paramMetadata.handle(ctx);
}

export function useErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  const errorHandlerInstance = container.resolve(errorHandler) as ErrorHandlerInterface;
  return async (context: RouterContext, next: Next) => {
    try {
      await next();
    } catch (e) {
      await errorHandlerInstance.handle(e, context);
    }
  }
}

/**
 * Resolve middleware, can handle 'classic middlewares' and 'NFW middlewares'
 */
export function resolveMiddleware (middleware: Middleware | Class<MiddlewareInterface>) {
  if (!isClass(middleware)) {
    return middleware;
  }
  const instance = container.resolve(middleware);
  return instance.use.bind(instance);
}

export function middlewaresForTarget (target: Class<unknown>, propertyName?: string) {
  const endpointMiddlewares = MetadataStorage.instance.getMiddlewaresForTarget(target, propertyName)
    .map((m) => resolveMiddleware(m.middleware));
  return endpointMiddlewares;
}
