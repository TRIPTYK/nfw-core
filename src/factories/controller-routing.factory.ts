import Router from '@koa/router';
import type Application from 'koa';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { Class } from '../types/class.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createRoute } from './controller-routes.factory.js';

/**
 * Handles creating controller-level route
 */
export function createController (parentRoute: Router | Application, controller: Class<unknown>, applicationOptions: CreateApplicationOptions) {
  const controllerMetadata = MetadataStorage.instance.controllers.find((controllerMeta) => controllerMeta.target === controller);

  if (!controllerMetadata) {
    throw new Error(`Please decorate ${controller.constructor.name} with @Controller`);
  }

  const controllerRouter = new Router({
    prefix: controllerMetadata.routeName,
    sensitive: true
  });

  container.registerSingleton(controllerMetadata.target);
  const controllerInstance = container.resolve(controllerMetadata.target);
  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controllerMetadata.target);
  const controllerMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target).reverse();

  /**
     * Only one error handler per controller
     */
  const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target);
  const applyMiddlewares = controllerMiddlewares.map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

  if (errorHandlerMeta) {
    applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
  }

  controllerRouter.use(...applyMiddlewares);

  for (const routeMetadata of controllerRoutesMeta) {
    createRoute(controllerMetadata, controllerRouter, controllerInstance, routeMetadata, applicationOptions);
  }

  for (const controllerClass of controllerMetadata.controllers ?? []) {
    createController(controllerRouter, controllerClass, applicationOptions);
  }

  parentRoute.use(controllerRouter.routes(), allowedMethods(controllerRouter));
}
