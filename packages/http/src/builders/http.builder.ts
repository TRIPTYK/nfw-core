import Router from '@koa/router';
import type { RouteBuilderInterface, RouteMetadataArgs } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.decorator.js';
import { handleHttpRouteControllerAction } from '../factories/controller-action.factory.js';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';

export class HttpBuilder implements RouteBuilderInterface {
  declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  async build (): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);
    const applyMiddlewares = MetadataStorage.instance.getMiddlewaresForTarget(this.context.meta.target)
      .map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    const errorHandlerMeta = MetadataStorage.instance.getErrorHandlerForTarget(this.context.meta.target);

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    for (const endPointMeta of endpointsMeta) {
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    return controllerRouter;
  }

  protected setupEndpoint (router:Router, endPointMeta: HttpEndpointMetadataArgs) {
    const middlewaresForEndpoint =
      MetadataStorage.instance.getMiddlewaresForTarget(this.context.meta.target.prototype, endPointMeta.propertyName)
        .map((m) => resolveMiddleware(m.middleware))

    /**
   * Only one error handler per controller route
   */
    const errorHandlerForRouteMeta = MetadataStorage.instance.getErrorHandlerForTarget(this.context.meta.target, endPointMeta.propertyName);

    if (errorHandlerForRouteMeta) {
      middlewaresForEndpoint.unshift(useErrorHandler(errorHandlerForRouteMeta.errorHandler));
    }

    router[endPointMeta.method](endPointMeta.args.routeName, ...middlewaresForEndpoint, handleHttpRouteControllerAction(this.context.instance, this.context.meta, endPointMeta));
  }

  async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }
}