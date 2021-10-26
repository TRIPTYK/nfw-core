import Router from '@koa/router';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';
import { CreateApplicationOptions } from './application.factory.js';
import { handleRouteControllerAction } from './controller-action.factory.js';

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
