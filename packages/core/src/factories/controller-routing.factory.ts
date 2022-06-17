import type Router from '@koa/router';
import type Application from 'koa';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { RouteBuilderInterface } from '../storages/metadata/route.metadata.js';
import type { Class } from '../types/class.js';
import type { CreateApplicationOptions } from './application.factory.js';

/**
 * Handles creating controller-level route
 */
export async function createRoute (parentRoute: Router | Application, controller: Class<unknown>, applicationOptions: CreateApplicationOptions) {
  const controllerMetadata = MetadataStorage.instance.routes.find((controllerMeta) => controllerMeta.target === controller);

  if (!controllerMetadata) {
    throw new Error(`Please decorate ${controller.constructor.name} with @Route`);
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

  const endpointsMeta = MetadataStorage.instance.endpoints.filter((rMetadata) => (rMetadata.target as Class<unknown>).constructor === controllerMetadata.target);
  const controllerMiddlewaresMeta = MetadataStorage.instance.useMiddleware.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target).reverse();

  const controllerRouter = await builder.build({ controllerMiddlewaresMeta });

  for (const endpointMeta of endpointsMeta) {
    const endpointMiddlewaresMeta = MetadataStorage.instance.useMiddleware.filter((middlewareMeta) => (middlewareMeta.target as Class<unknown>).constructor === controllerMetadata.target && middlewareMeta.propertyName === endpointMeta.propertyName).reverse(); // reverse because decorators call are inversed
    await builder.endpoint(controllerRouter, { endpointMiddlewaresMeta, endpointMeta });
  }

  /**
   * Recursive controller
   */
  for (const controllerClass of controllerMetadata.controllers ?? []) {
    createRoute(controllerRouter, controllerClass, applicationOptions);
  }

  await builder.routing(parentRoute, controllerRouter);
}
