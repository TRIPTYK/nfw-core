import Router from '@koa/router';
import { container } from 'tsyringe';
import { MetadataStorage } from '../storages/metadata-storage.js';
import type { AreaMetadataArgs } from '../storages/metadata/area.metadata.js';
import type { Constructor } from '../types/contructor.js';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { resolveMiddleware, useErrorHandler, useNotFoundMiddleware } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createController } from './controller-routing.factory.js';

/**
 * Handles creating area-level route
 */
export function createArea (areaMetadata: AreaMetadataArgs, areaRouter: Router, applicationOptions: CreateApplicationOptions) {
  container.registerSingleton(areaMetadata.target as Constructor<unknown>);
  const areaControllerMeta = MetadataStorage.instance.controllers.filter((cMetadata) => areaMetadata.controllers.includes(cMetadata.target));

  const areaMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === areaMetadata.target && middlewareMeta.type === 'classic').reverse();
  const notFoundMiddlewares = MetadataStorage.instance.useMiddlewares.filter((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === areaMetadata.target && middlewareMeta.type === 'not-found').reverse();

  /**
     * Only one error handler per controller route
     */
  const errorHandlerMeta = MetadataStorage.instance.useErrorHandler.find((middlewareMeta) => middlewareMeta.propertyName === undefined && middlewareMeta.target === areaMetadata.target);

  const applyMiddlewares = areaMiddlewares.map((areaMiddlewareMeta) => resolveMiddleware(areaMiddlewareMeta.middleware));
  const applyNotFoundMiddlewares = notFoundMiddlewares.map((middlewareMeta) => useNotFoundMiddleware(middlewareMeta.middleware));

  if (errorHandlerMeta) {
    applyMiddlewares.unshift(useErrorHandler(errorHandlerMeta.errorHandler));
  }

  areaRouter.use(...applyMiddlewares);

  for (const controllerMetadata of areaControllerMeta) {
    const controllerRouter = new Router({
      prefix: controllerMetadata.routeName
    });
    createController(areaMetadata, controllerMetadata, controllerRouter, applicationOptions);
    areaRouter.use(controllerRouter.routes(),
      allowedMethods(controllerRouter)
    );
  }

  /**
     * Catch all route for not found
     */
  areaRouter.all('(.*)', ...applyNotFoundMiddlewares);
}
