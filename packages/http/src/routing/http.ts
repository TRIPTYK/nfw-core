import Router from '@koa/router';
import type { RouteMetadataArgs, RouterBuilderInterface } from '@triptyk/nfw-core';
import { container } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.js';
import { handleHttpRouteControllerAction } from './controller-action.js';
import type { HttpEndpointMetadataArgs } from '../storages/metadata/endpoint.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.js';
import { middlewaresForTarget } from '../utils/factory.js';

export class HttpBuilder implements RouterBuilderInterface {
  public declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  public async build (): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });

    const endpointsMeta = container.resolve(MetadataStorage).getEndpointsForTarget(this.context.meta.target);
    const applyMiddlewares = middlewaresForTarget(this.context.meta.target);

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
    router[endPointMeta.method](endPointMeta.args.routeName, ...endpointMiddlewares, handleHttpRouteControllerAction(this.context.instance, this.context.meta, endPointMeta.propertyName));
  }
}
