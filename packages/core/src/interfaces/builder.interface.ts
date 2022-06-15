import type Router from '@koa/router';
import type { ControllerMetadataArgs } from '../storages/metadata/controller.metadata.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.metadata.js';
import type { UseErrorHandlerMetadataArgs } from '../storages/metadata/use-error-handler.metadata.js';
import type { UseMiddlewareMetadataArgs } from '../storages/metadata/use-middleware.metadata.js';

export interface BuilderControllerParams {
    controllerMiddlewares: UseMiddlewareMetadataArgs[],
    errorHandler?: UseErrorHandlerMetadataArgs,
  }

export interface BuilderRouteParams {
routeMetadata: RouteMetadataArgs,
controllerRouter: Router,
middlewaresForRoute: UseMiddlewareMetadataArgs[],
errorHandlerForRouteMeta?: UseErrorHandlerMetadataArgs,
}

export interface BuilderContext {
  controllerInstance: unknown,
  controllerMetadata: ControllerMetadataArgs,
  args: unknown[],
}

export interface BuilderInterface {
  context: BuilderContext,
  buildRouter (params: BuilderControllerParams) : Promise<Router>,
  buildEndpoint (params : BuilderRouteParams): Promise<unknown>,
}
