import { RouterContext } from '@koa/router';
import isClass from 'is-class';
import { Middleware, Next } from 'koa';
import { container } from 'tsyringe';
import { MiddlewareInterface, ErrorHandlerInterface } from '../index.js';
import { ControllerParamsContext, UseParamsMetadataArgs } from '../storages/metadata/use-params.metadata.js';
import { Class } from '../types/class.js';

export function applyParam (paramMetadata: UseParamsMetadataArgs, ctx: ControllerParamsContext) {
  return paramMetadata.handle(ctx);
}

export function resolveMiddleware (middleware: Middleware | Class<MiddlewareInterface>) {
  if (!isClass(middleware)) {
    return middleware;
  }
  return container.resolve(middleware).use;
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
