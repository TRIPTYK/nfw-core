import Router from '@koa/router';
import type { EndpointMetadataArgs, EndpointMetaParams, RouteBuilderInterface, RouteMetadataArgs, UseMiddlewareMetadataArgs } from '@triptyk/nfw-core';
import { resolveMiddleware } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.decorator.js';
import { handleRouteControllerAction } from '../factories/controller-action.factory.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { useErrorHandler } from '../utils/factory.util.js';

interface HttpEndpointMetaParams extends EndpointMetaParams {
    endpointMeta: EndpointMetadataArgs<{
        routeName: string,
    }>,
}

export class HttpBuilder implements RouteBuilderInterface {
  declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  async build ({ controllerMiddlewaresMeta }: { controllerMiddlewaresMeta: UseMiddlewareMetadataArgs[] }): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === this.context.meta.target);
    const applyMiddlewares = controllerMiddlewaresMeta.map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    return controllerRouter;
  }

  async endpoint (router: Router, { endpointMiddlewaresMeta, endpointMeta }: HttpEndpointMetaParams): Promise<void> {
    const middlewaresForRoute = endpointMiddlewaresMeta
      .map((middlewareMeta) => resolveMiddleware(middlewareMeta.middleware));

    /**
   * Only one error handler per controller route
   */
    const errorHandlerForRouteMeta = MetadataStorage.instance.useErrorHandler.find((errorHandlerMeta) => errorHandlerMeta.target.constructor === this.context.meta.target && errorHandlerMeta.propertyName === endpointMeta.propertyName);

    if (errorHandlerForRouteMeta) {
      middlewaresForRoute.unshift(useErrorHandler(errorHandlerForRouteMeta.errorHandler));
    }

    router[endpointMeta.method](endpointMeta.args.routeName, ...middlewaresForRoute, handleRouteControllerAction(this.context.instance, this.context.meta, endpointMeta));
  }

  async routing (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }
}
