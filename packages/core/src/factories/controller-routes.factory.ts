import type Router from '@koa/router';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';
import { handleRouteControllerAction } from './controller-action.factory.js';

/**
 * Handles creating sub-route of controller
 */
export function createRoute (controllerMetadata: ControllerMetadataArgs, controllerRouter: Router, controllerInstance: unknown, routeMetadata: RouteMetadataArgs) {
  const middlewaresForRoute = MetadataStorage.instance.useMiddlewares
    .filter((middlewareMeta) => middlewareMeta.target.constructor === controllerMetadata.target && middlewareMeta.propertyName === routeMetadata.propertyName)
    .reverse()// reverse because decorators call are inversed
    .map((middlewareMeta) => resolveMiddleware(middlewareMeta.middleware));

  /**
   * Only one error handler per controller route
   */
  const errorHandlerForRouteMeta = MetadataStorage.instance.useErrorHandler.find((errorHandlerMeta) => errorHandlerMeta.target.constructor === controllerMetadata.target && errorHandlerMeta.propertyName === routeMetadata.propertyName);

  if (errorHandlerForRouteMeta) {
    middlewaresForRoute.unshift(useErrorHandler(errorHandlerForRouteMeta.errorHandler));
  }

  controllerRouter[routeMetadata.method](routeMetadata.routeName, ...middlewaresForRoute, handleRouteControllerAction(controllerInstance, controllerMetadata, routeMetadata));
}
