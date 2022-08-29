import Router from '@koa/router';
import type { RouteBuilderInterface, RouteMetadataArgs } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.decorator.js';
import { handleHttpRouteControllerAction } from '../factories/controller-action.factory.js';
import type { HttpEndpointMetadataArgs } from '../interfaces/endpoint.metadata.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { middlewaresForTarget, resolveMiddleware } from '../utils/factory.util.js';

export class HttpBuilder implements RouteBuilderInterface {
  public declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  public async build (): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const endpointsMeta = MetadataStorage.instance.getEndpointsForTarget(this.context.meta.target);
    const applyMiddlewares = MetadataStorage.instance.getMiddlewaresForTarget(this.context.meta.target)
      .map((controllerMiddlewareMeta) => resolveMiddleware(controllerMiddlewareMeta.middleware));

    controllerRouter.use(...applyMiddlewares);

    for (const endPointMeta of endpointsMeta) {
      this.setupEndpoint(controllerRouter, endPointMeta);
    }

    return controllerRouter;
  }

  public async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }

  protected setupEndpoint (router:Router, endPointMeta: HttpEndpointMetadataArgs) {
    const endpointMiddlewares = middlewaresForTarget(this.context.meta.target.prototype, endPointMeta.propertyName);
    router[endPointMeta.method](endPointMeta.args.routeName, ...endpointMiddlewares, handleHttpRouteControllerAction(this.context.instance, this.context.meta, endPointMeta));
  }
}
