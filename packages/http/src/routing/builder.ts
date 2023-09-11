import Router from '@koa/router';
import { injectable, inject } from '@triptyk/nfw-core';
import type { ControllerMetaArgs } from '../decorators/controller.js';
import { ControllerActionBuilder } from './controller-action.js';
import type { HttpEndpointMetadataArgs } from '../storages/metadata/endpoint.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.js';
import { middlewaresInstancesForTarget } from '../utils/middlewares.js';
import type { RouterBuilderInterface } from '../interfaces/router-builder.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';
import { ControllerActionResolver } from '../resolvers/controller-action-resolver.js';

import type { ControllerContextType } from '../types/controller-context.js';
import { GuardResolver } from '../resolvers/guard-resolver.js';
import { ResponseHandlerResolver } from '../resolvers/response-handler-resolver.js';

@injectable()
export class HttpBuilder implements RouterBuilderInterface {
  public declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  public constructor (
    @inject(MetadataStorage) public metadataStorage: MetadataStorage
  ) {}

  public async build (): Promise<Router> {
    const controllerRouter = new Router({
      prefix: (this.context.meta.args as ControllerMetaArgs).routeName
    });
    const endpointsMeta = this.metadataStorage.getEndpointsForTarget(this.context.meta.target);
    const applyMiddlewares = middlewaresInstancesForTarget(this.context.meta.target);

    controllerRouter.use(...applyMiddlewares);

    this.setupEndpoints(endpointsMeta, controllerRouter);

    return controllerRouter;
  }

  // eslint-disable-next-line class-methods-use-this
  public async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }

  protected setupEndpoint (router:Router, endPointMeta: HttpEndpointMetadataArgs) {
    const endpointMiddlewares = middlewaresInstancesForTarget(this.context.meta.target.prototype as never, endPointMeta.propertyName);

    const controllerContext = this.createControllerContext(endPointMeta);
    const controllerActionBuilder = this.createActionBuilder(controllerContext);

    router[endPointMeta.method](endPointMeta.args.routeName, ...endpointMiddlewares, controllerActionBuilder.build());
  }

  private createControllerContext (endPointMeta: HttpEndpointMetadataArgs): ControllerContextType<any> {
    return {
      controllerInstance: this.context.instance,
      controllerAction: endPointMeta.propertyName
    };
  }

  private createActionBuilder (controllerContext: ControllerContextType<any>) {
    const actionResolver = new ControllerActionResolver(this.metadataStorage, controllerContext);
    const guardResolver = new GuardResolver(this.metadataStorage, controllerContext);
    const responseHandlerResolver = new ResponseHandlerResolver(this.metadataStorage, controllerContext);

    return new ControllerActionBuilder(
      guardResolver,
      responseHandlerResolver,
      actionResolver
    );
  }

  private setupEndpoints (endpointsMeta: HttpEndpointMetadataArgs[], controllerRouter: Router) {
    for (const endPointMeta of endpointsMeta) {
      this.setupEndpoint(controllerRouter, endPointMeta);
    }
  }
}
