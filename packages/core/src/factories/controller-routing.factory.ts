import type Router from '@koa/router';
import type Application from 'koa';
import { container } from 'tsyringe';
import type { Class } from 'type-fest';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { RouteBuilderInterface } from '../storages/metadata/route.metadata.js';
import type { CreateApplicationOptions } from './application.factory.js';

/**
 * Handles creating controller-level route
 */
export async function createRoute (parentRoute: Router | Application, controller: Class<unknown>, applicationOptions: CreateApplicationOptions) {
  const controllerMetadata = MetadataStorage.instance.routes.find((controllerMeta) => controllerMeta.target === controller);

  if (!controllerMetadata) {
    throw new Error(`Please register ${controller.constructor.name} in the metadata-storage`);
  }

  /**
   * The controller is always a singleton
   */
  container.registerSingleton(controllerMetadata.target);

  /**
   * Create instance of the singleton
   */
  const controllerInstance = container.resolve(controllerMetadata.target);

  const builder = container.resolve(controllerMetadata.builder) as RouteBuilderInterface;
  builder.context = {
    instance: controllerInstance,
    meta: controllerMetadata
  };

  const controllerRouter = await builder.build();

  /**
   * Recursive controller
   */
  await Promise.all((controllerMetadata.controllers ?? []).map((c) => createRoute(controllerRouter, c, applicationOptions)));

  /**
   * After all sub-controllers
   */
  await builder.bindRouting(parentRoute, controllerRouter);
}
