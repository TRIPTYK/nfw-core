/* eslint-disable max-statements */
import Router from '@koa/router';
import { injectable, inject } from '@triptyk/nfw-core';
import { ControllerActionBuilder } from '../routing/controller-action.js';
import type { HttpEndpointMetadataArgs } from '../storages/metadata/endpoint.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { allowedMethods } from '../utils/allowed-methods.js';
import { afterMiddlewaresInstancesForTarget, beforeMiddlewaresInstancesForTarget } from '../utils/middlewares.js';
import type { RouterBuilderArguments, RouterBuilderInterface } from '../interfaces/router-builder.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';
import { ControllerActionResolver } from '../resolvers/controller-action-resolver.js';

import type { ControllerContextType } from '../types/controller-context.js';
import { GuardResolver } from '../resolvers/guard-resolver.js';
import { ResponseHandlerResolver } from '../resolvers/response-handler-resolver.js';

export interface DefaultBuilderArgs {
  routeName: string,
}

@injectable()
export class DefaultBuilder implements RouterBuilderInterface<DefaultBuilderArgs> {
  public constructor (
    @inject(MetadataStorage) public metadataStorage: MetadataStorage
  ) {}

  public async build (context: RouterBuilderArguments<DefaultBuilderArgs>): Promise<Router> {
    const controllerRouter = new Router({
      prefix: context.args.routeName
    });
    const endpointsMeta = this.metadataStorage.getEndpointsForTarget(context.controllerInstance.constructor);

    controllerRouter.use(...beforeMiddlewaresInstancesForTarget(context.controllerInstance.constructor));

    this.setupEndpoints(endpointsMeta, controllerRouter, context);

    controllerRouter.use(...afterMiddlewaresInstancesForTarget(context.controllerInstance.constructor));

    return controllerRouter;
  }

  // eslint-disable-next-line class-methods-use-this
  public async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes())
      .use(allowedMethods(router));
  }

  protected setupEndpoint (
    router:Router, 
    endPointMeta: HttpEndpointMetadataArgs,
    { controllerInstance }: RouterBuilderArguments<DefaultBuilderArgs>
  ) {
    const beforeMiddlewares = beforeMiddlewaresInstancesForTarget(controllerInstance, endPointMeta.propertyName);
    const afterMiddlewares = afterMiddlewaresInstancesForTarget(controllerInstance, endPointMeta.propertyName);

    const controllerContext = this.createControllerContext(endPointMeta, controllerInstance);
    const controllerActionBuilder = this.createActionBuilder(controllerContext);

    router[endPointMeta.method](endPointMeta.args.routeName, ...beforeMiddlewares, controllerActionBuilder.build(), ...afterMiddlewares);
  }

  private createControllerContext (endPointMeta: HttpEndpointMetadataArgs,controllerInstance: InstanceType<any>): ControllerContextType<any> {
    return {
      controllerInstance,
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

  private setupEndpoints (endpointsMeta: HttpEndpointMetadataArgs[], controllerRouter: Router, context: RouterBuilderArguments<DefaultBuilderArgs>) {
    for (const endPointMeta of endpointsMeta) {
      this.setupEndpoint(controllerRouter, endPointMeta,  context);
    }
  }
}
