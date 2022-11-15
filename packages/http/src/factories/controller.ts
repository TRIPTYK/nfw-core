import type Router from '@koa/router';
import { container } from '@triptyk/nfw-core';
import type Application from 'koa';
import type { Class } from 'type-fest';
import type { MetadataStorageInterface } from '../interfaces/metadata-storage.js';
import type { RouterBuilderInterface } from '../interfaces/router-builder.js';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';

export class RouterBuilderFactory {
  public constructor (
    public metadataStorage: MetadataStorageInterface,
    private parentRoute: Router | Application,
    private controller: Class<unknown>
  ) {}

  public async createRoute () {
    const controllerMetadata = this.metadataStorage.findRouteForTarget(this.controller);
    const controllerInstance = container.resolve(controllerMetadata.target);
    const builder = container.resolve(controllerMetadata.builder);

    await this.callBuilder(builder, controllerInstance, controllerMetadata);
  }

  private async callBuilder (builder: RouterBuilderInterface, controllerInstance: unknown, controllerMetadata: RouteMetadataArgs<unknown>) {
    builder.context = {
      instance: controllerInstance,
      meta: controllerMetadata
    };

    const controllerRouter = await builder.build();

    await this.createNestedRouters(controllerMetadata);

    await builder.bindRouting(this.parentRoute, controllerRouter);
  }

  private async createNestedRouters (controllerMetadata: RouteMetadataArgs<unknown>) {
    await Promise.all((controllerMetadata.controllers ?? []).map(async (c) => new RouterBuilderFactory(this.metadataStorage, this.parentRoute, c).createRoute()));
  }
}
