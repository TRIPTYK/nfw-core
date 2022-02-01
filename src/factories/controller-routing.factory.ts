import type Router from '@koa/router';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import { resolveMiddleware, useErrorHandler, useNotFoundMiddleware } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createRoute } from './controller-routes.factory.js';

/**
 * Handles creating controller-level route
 */
export function createController (controllerMetadata: ControllerMetadataArgs, controllerRouter: Router, applicationOptions: CreateApplicationOptions) {
  container.registerSingleton(controllerMetadata.target);
  const controllerInstance = container.resolve(controllerMetadata.target);
  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controllerMetadata.target);

  const controllerMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target && middlewareMeta.type === 'classic').reverse();
  const notFoundMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target && middlewareMeta.type === 'not-found').reverse();

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
