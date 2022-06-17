import Router from '@koa/router';
import type { Class, RouteBuilderInterface, RouteMetadataArgs } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.decorator.js';
import type { EndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';

export class HttpBuilder implements RouteBuilderInterface {
  declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  async build (): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const endpointsMeta = MetadataStorage.instance.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === this.context.meta.target);
    const controllerMiddlewaresMeta = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === this.context.meta.target).reverse();

    const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === this.context.meta.target);
    const applyMiddlewares = controllerMiddlewaresMeta.map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    if (errorHandlerMeta) {
      applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
    }

    controllerRouter.use(...applyMiddlewares);

    for (const endPointMeta of endpointsMeta) {
      this.setupRoute(endPointMeta);
    }

    return controllerRouter;
  }

  private setupRoute (endPointMeta: EndpointMetadataArgs) {
    console.log(endPointMeta)
  }

  async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }
}
