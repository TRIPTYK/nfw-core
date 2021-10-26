import Router, { RouterContext } from '@koa/router';
import { isClass } from 'is-class';
import { Middleware, Next } from 'koa';
import { container } from 'tsyringe';
import { ErrorHandlerInterface, ResponseHandlerInterface } from '../index.js';
import { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { ControllerMetadataArgs } from '../storage/metadata/controller.metadata.js';
import { RouteMetadataArgs } from '../storage/metadata/route.metadata.js';
import { UseParamsMetadataArgs } from '../storage/metadata/use-params.metadata.js';
import { CreateApplicationOptions } from './create-application.js';
import createError from 'http-errors';
import { Class } from '../types/class.js';

export function createRouting (applicationRouter: Router, applicationOptions: CreateApplicationOptions) {
  const globalMiddlewaresMeta = applicationOptions.globalMiddlewares ?? [];
  const resolvedMiddlewares = globalMiddlewaresMeta.map(resolveMiddleware);

  if (applicationOptions.globalErrorhandler) {
    resolvedMiddlewares.unshift(useErrorHandler(applicationOptions.globalErrorhandler));
  }

  applicationRouter.use(...resolvedMiddlewares);

  for (const controller of applicationOptions.controllers) {
    const controllerMetadata = MetadataStorage.instance.controllers.find((cMetadata) => cMetadata.target === controller);

    const controllerRouter = new Router({
      prefix: controllerMetadata.routeName
    });
    createController(controllerMetadata, controllerRouter, applicationOptions);
    applicationRouter.use(controllerRouter.routes());
  }

  /**
   * Catch all route for 404
   */
  applicationRouter.all('(.*)', useNotFoundMiddleware(applicationOptions.globalNotFoundMiddleware));
}

/**
 * Handles creating controller-level route
 */
export function createController (controllerMetadata: ControllerMetadataArgs, controllerRouter: Router, applicationOptions: CreateApplicationOptions) {
  container.registerSingleton(controllerMetadata.target);
  const controllerInstance = container.resolve(controllerMetadata.target);
  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controllerMetadata.target);

  const controllerMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target && middlewareMeta.type === 'classic');
  const notFoundMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target && middlewareMeta.type === 'not-found');

  /**
   * Only one error handler per controller route
   */
  const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target);

  const applyMiddlewares = controllerMiddlewares.map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));
  const applyNotFoundMiddlewares = notFoundMiddlewares.map((middlewareMeta) => useNotFoundMiddleware(middlewareMeta.middleware));

  if (errorHandlerMeta) {
    applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
  }

  controllerRouter.use(...applyMiddlewares);

  for (const routeMetadata of controllerRoutesMeta) {
    createRoute(controllerRouter, controllerInstance, controllerMetadata, routeMetadata, applicationOptions);
  }

  /**
   * Catch all route for not found
   */
  controllerRouter.all('(.*)', ...applyNotFoundMiddlewares);
}

export function applyParam (paramMetadata: UseParamsMetadataArgs, ctx: RouterContext) {
  return paramMetadata.handle(ctx, paramMetadata.args);
}

export function resolveMiddleware (middleware: Middleware | Class<MiddlewareInterface>) {
  if (!isClass(middleware)) {
    return middleware as Middleware;
  }
  return container.resolve(middleware).use;
}

/**
 * Handles creating sub-route of controller
 *
 */
export function createRoute (controllerRouter: Router, controllerInstance: unknown, controllerMetadata: ControllerMetadataArgs, routeMetadata: RouteMetadataArgs, applicationOptions: CreateApplicationOptions) {
  const middlewaresForRoute = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.target.constructor === controllerMetadata.target && middlewareMeta.propertyName === routeMetadata.propertyName && middlewareMeta.type === 'classic');

  /**
   * Only one error handler per controller route
   */
  const errorHandlerForRouteMeta = MetadataStorage.instance.useErrorHandler.find((errorHandlerMeta) => errorHandlerMeta.target.constructor === controllerMetadata.target && errorHandlerMeta.propertyName === routeMetadata.propertyName);

  const middlewareInstances = middlewaresForRoute.map((middlewareMeta) => resolveMiddleware(middlewareMeta.middleware));

  if (errorHandlerForRouteMeta) {
    middlewareInstances.unshift(useErrorHandler(errorHandlerForRouteMeta.errorHandler));
  }

  controllerRouter[routeMetadata.method](routeMetadata.routeName, ...middlewareInstances, handleRouteControllerAction(controllerInstance, controllerMetadata, routeMetadata, applicationOptions));
}

export function handleRouteControllerAction (controllerInstance: unknown, controllerMetadata: ControllerMetadataArgs, routeMetadata: RouteMetadataArgs, applicationOptions: CreateApplicationOptions) {
  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;
  const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controllerMetadata.target && paramMeta.propertyName === routeMetadata.propertyName).sort((a, b) => a.index - b.index);
  const responsehandlerForRouteMetadata = MetadataStorage.instance.useResponseHandlers.find((guardMeta) => {
    /**
     * If on controller level
     */
    if (guardMeta.propertyName === undefined) {
      return guardMeta.target === controllerMetadata.target;
    }
    /**
     * If on controller action level
     */
    return guardMeta.target.constructor === controllerMetadata.target && guardMeta.propertyName === routeMetadata.propertyName;
  });
  const guardForRouteMetadata = MetadataStorage.instance.useGuards.filter((guardMeta) => {
    /**
     * If on controller level
     */
    if (guardMeta.propertyName === undefined) {
      return guardMeta.target === controllerMetadata.target;
    }
    /**
     * If on controller action level
     */
    return guardMeta.target.constructor === controllerMetadata.target && guardMeta.propertyName === routeMetadata.propertyName;
  });

  /**
   * Pre-fetch gaurds and response-handlers to do not resolve every request
   */
  let responseHandlerInstance: ResponseHandlerInterface;

  if (responsehandlerForRouteMetadata) {
    responseHandlerInstance = container.resolve(responsehandlerForRouteMetadata.responseHandler);
  }

  const guardsInstance = guardForRouteMetadata.map((guardMeta) => {
    return {
      instance: container.resolve(guardMeta.guard),
      args: guardMeta.args
    }
  });

  if ((applicationOptions.globalGuards ?? []).length) {
    const resolvedGlobalGuards = applicationOptions.globalGuards.map((e) => {
      return {
        instance: container.resolve(e.guard),
        args: e.args
      }
    });
    /**
     * Add global guards before other guards
     */
    guardsInstance.unshift(...resolvedGlobalGuards);
  }

  return async (ctx: RouterContext, _next: Next) => {
    /**
     * Guards are executed one at a time
     */
    for (const { instance, args } of guardsInstance) {
      const guardResponse = await instance.can({
        controllerAction: routeMetadata.propertyName,
        controllerInstance,
        request: ctx.request,
        args
      });
      if (!guardResponse) {
        ctx.response.status = 403;
        throw createError(403);
      }
    }

    /**
     * Call main controller action and apply decorator params
     */
    const controllerActionResult = await controllerMethod.call(controllerInstance, ...paramsForRouteMetadata.map((e) => applyParam(e, ctx)));

    /**
     * Handle controller action response
     */
    if (responseHandlerInstance) {
      await responseHandlerInstance.handle(controllerActionResult, {
        controllerAction: routeMetadata.propertyName,
        controllerInstance,
        response: ctx.response,
        args: responsehandlerForRouteMetadata.args
      });
    } else {
      ctx.response.body = controllerActionResult;
    }
  };
}

function useErrorHandler (errorHandler: Class<ErrorHandlerInterface>) {
  const errorHandlerInstance = container.resolve(errorHandler);
  return async (context: RouterContext, next: Next) => {
    try {
      await next();
    } catch (e) {
      await errorHandlerInstance.handle(e, context);
    }
  }
}

function useNotFoundMiddleware (middlewareNotFound: Class<MiddlewareInterface> | Middleware) {
  const middlewareInstance = resolveMiddleware(middlewareNotFound);
  return async (context: RouterContext, next: Next) => {
    await next();
    if (context.status === 404) {
      context.status = 404;
      await middlewareInstance(context, next);
    }
  }
}
