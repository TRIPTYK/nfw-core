import Router, { RouterContext } from '@koa/router';
import { isClass } from 'is-class';
import { Middleware, Next } from 'koa';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storage/metadata-storage.js';
import { ControllerMetadataArgs } from '../storage/metadata/controller.js';
import { RouteMetadataArgs } from '../storage/metadata/route.js';
import { UseMiddlewareMetadataArgs } from '../storage/metadata/use-middleware.js';
import { UseParamsMetadataArgs } from '../storage/metadata/use-params.js';
import { CreateApplicationOptions } from './create-application.js';

export function createRouting (applicationRouter: Router, applicationOptions: CreateApplicationOptions) {
  for (const controller of applicationOptions.controllers) {
    const controllerMetadata = MetadataStorage.instance.controllers.find((cMetadata) => cMetadata.target === controller);
    const controllerRouter = new Router({
      prefix: controllerMetadata.routeName
    });
    createController(controllerMetadata, controllerRouter);
    applicationRouter.use(controllerRouter.routes());
  }
}

/**
 * Handles creating controller-level route
 */
export function createController (controllerMetadata: ControllerMetadataArgs, controllerRouter: Router) {
  container.registerSingleton(controllerMetadata.target);
  const controllerInstance = container.resolve(controllerMetadata.target);
  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controllerMetadata.target);

  const controllerMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target);

  controllerRouter.use(...controllerMiddlewares.map(useMiddleware));

  for (const routeMetadata of controllerRoutesMeta) {
    createRoute(controllerRouter, controllerInstance, controllerMetadata, routeMetadata);
  }
}

export function applyParam (paramMetadata: UseParamsMetadataArgs, ctx: RouterContext) {
  return paramMetadata.handle(ctx, paramMetadata.args);
}

export function useMiddleware (middlewareMeta: UseMiddlewareMetadataArgs) {
  if (!isClass(middlewareMeta.middleware)) {
    return middlewareMeta.middleware as Middleware;
  }
  return container.resolve(middlewareMeta.middleware).use;
}

/**
 * Handles creating sub-route of controller
 *
 */
export function createRoute (controllerRouter: Router, controllerInstance: unknown, controllerMetadata: ControllerMetadataArgs, routeMetadata: RouteMetadataArgs) {
  const paramsForRouteMetadata = MetadataStorage.instance.useParams.filter((paramMeta) => paramMeta.target.constructor === controllerMetadata.target && paramMeta.propertyKey === routeMetadata.propertyName).sort((a, b) => a.index - b.index);

  const middlewaresForRoute = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.target.constructor === controllerMetadata.target && middlewareMeta.propertyName === routeMetadata.propertyName);

  const controllerMethod = controllerInstance[routeMetadata.propertyName] as Function;
  controllerRouter[routeMetadata.method](routeMetadata.routeName, ...middlewaresForRoute.map(useMiddleware), (ctx: RouterContext, next: Next) => {
    controllerMethod.call(controllerInstance, ...paramsForRouteMetadata.map((e) => applyParam(e, ctx)));
  })
}
