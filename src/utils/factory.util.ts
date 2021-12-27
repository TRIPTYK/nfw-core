import { RouterContext, Middleware } from '@koa/router';
import isClass from 'is-class';
import { Next } from 'koa';
import { container } from 'tsyringe';
import { ControllerContextInterface } from '../interfaces/controller-context.interface.js';
import { ErrorHandlerInterface } from '../interfaces/error-middleware.interface.js';
import { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import { ControllerParamsContext, UseParamsMetadataArgs } from '../storages/metadata/use-param.metadata.js';
import { Class } from '../types/class.js';

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

export function useErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  const errorHandlerInstance = container.resolve(errorHandler);
  return async (context: RouterContext, next: Next) => {
    try {
      await next();
    } catch (e) {
      await errorHandlerInstance.handle(e, context);
    }
  }
}

export function useNotFoundMiddleware (middlewareNotFound: Class<MiddlewareInterface> | Middleware) {
  const middlewareInstance = resolveMiddleware(middlewareNotFound);
  return async (context: RouterContext, next: Next) => {
    await next();
    if (context.status === 404) {
      context.status = 404;
      await middlewareInstance(context, next);
    }
  }
}