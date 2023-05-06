import type Router from '@koa/router';
import { container } from '@triptyk/nfw-core';
import type Application from 'koa';
import type { Class } from 'type-fest';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { RouterBuilderInterface } from '../interfaces/router-builder.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';

export class RouterBuilder {
  public constructor (
    private metadataStorage: MetadataStorageInterface,
    private parentRoute: Router | Application,
    private controller: Class<unknown>
  ) {}

  public async createRoute () {
    const controllerMetadata = this.metadataStorage.findRouteForTarget(this.controller);
    const controllerInstance = container.resolve(controllerMetadata.target);
    const builder = container.resolve(controllerMetadata.builder);

    await this.callBuilder(builder, controllerInstance, controllerMetadata);
  }

  private async callBuilder (builder: RouterBuilderInterface<unknown>, controllerInstance: unknown, controllerMetadata: RouteMetadataArgs<unknown>) {
    const controllerRouter = await builder.build({
      controllerInstance,
      args: controllerMetadata.args
    });

    await this.createNestedRouters(controllerMetadata, controllerRouter);

    await builder.bindRouting(this.parentRoute, controllerRouter);
  }

  private async createNestedRouters (controllerMetadata: RouteMetadataArgs<unknown>, futureParentRouter: Router) {
    await Promise.all((controllerMetadata.controllers ?? []).map(async (c) => new RouterBuilder(this.metadataStorage, futureParentRouter, c).createRoute()));
  }
}
