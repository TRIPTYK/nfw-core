import type Router from '@koa/router';
import type Application from 'koa';
import { container } from 'tsyringe';
import { BaseBuilder } from '../builders/base.builder.js';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { Class } from '../types/class.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import type { CreateApplicationOptions } from './application.factory.js';

/**
 * Handles creating controller-level route
 */
export async function createController (parentRoute: Router | Application, controller: Class<unknown>, applicationOptions: CreateApplicationOptions) {
  const controllerMetadata = MetadataStorage.instance.controllers.find((controllerMeta) => controllerMeta.target === controller);

  if (!controllerMetadata) {
    throw new Error(`Please decorate ${controller.constructor.name} with @Controller`);
  }

  /**
   * The controller is always a singleton
   */
  container.registerSingleton(controllerMetadata.target);

  /**
   * Create instance of the singleton
   */
  const controllerInstance = container.resolve(controllerMetadata.target);

  const builder = container.resolve(controllerMetadata.builder ?? BaseBuilder);
  builder.context = { controllerInstance: controllerInstance as Function, controllerMetadata, args: controllerMetadata.args };

  const controllerRoutesMeta = MetadataStorage.instance.routes.filter((rMetadata) => rMetadata.target.constructor === controllerMetadata.target);
  const controllerMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target).reverse();
  /**
     * Only one error handler per controller route
     */
  const errorHandler = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === controllerMetadata.target);

  const controllerRouter = await builder.buildRouter({ controllerMiddlewares, errorHandler });

  for (const routeMetadata of controllerRoutesMeta) {
    const middlewaresForRoute = MetadataStorage.instance.useMiddlewares
      .filter((middlewareMeta) => middlewareMeta.target.constructor === controllerMetadata.target && middlewareMeta.propertyName === routeMetadata.propertyName)
      .reverse();// reverse because decorators call are inversed

    /**
     * Only one error handler per controller route
     */
    const errorHandlerForRouteMeta = MetadataStorage.instance.useErrorHandler.find((errorHandlerMeta) => errorHandlerMeta.target.constructor === controllerMetadata.target && errorHandlerMeta.propertyName === routeMetadata.propertyName);

    await builder.buildEndpoint({
      controllerRouter,
      routeMetadata,
      middlewaresForRoute,
      errorHandlerForRouteMeta
    });
  }

  /**
   * Recursive controller
   */
  for (const controllerClass of controllerMetadata.controllers ?? []) {
    createController(controllerRouter, controllerClass, applicationOptions);
  }

  parentRoute
    .use(controllerRouter.routes())
    .use(allowedMethods(controllerRouter));
}
