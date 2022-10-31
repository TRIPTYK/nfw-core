import type Router from '@koa/router';
import type Application from 'koa';
import { container } from 'tsyringe';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { CreateApplicationOptions } from './application.js';

export async function createRoute (parentRoute: Router | Application, controller: Class<unknown>, applicationOptions: CreateApplicationOptions) {
  const controllerMetadata = container.resolve(MetadataStorage).findRouteForTarget(controller);

  container.registerSingleton(controllerMetadata.target);

  const controllerInstance = container.resolve(controllerMetadata.target);
  const builder = container.resolve(controllerMetadata.builder);

  builder.context = {
    instance: controllerInstance,
    meta: controllerMetadata
  };

  const controllerRouter = await builder.build();

  await Promise.all((controllerMetadata.controllers ?? []).map((c) => createRoute(controllerRouter, c, applicationOptions)));

  await builder.bindRouting(parentRoute, controllerRouter);
}
