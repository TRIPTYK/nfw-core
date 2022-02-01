import Router from '@koa/router';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { resolveMiddleware, useErrorHandler, useNotFoundMiddleware } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createController } from './controller-routing.factory.js';

export function createRouting (applicationRouter: Router, applicationOptions: CreateApplicationOptions) {
  const globalMiddlewaresMeta = applicationOptions.globalMiddlewares ?? [];
  const resolvedMiddlewares = globalMiddlewaresMeta.map(resolveMiddleware);

  if (applicationOptions.globalErrorhandler) {
    resolvedMiddlewares.unshift(useErrorHandler(applicationOptions.globalErrorhandler));
  }

  applicationRouter.use(...resolvedMiddlewares);

  for (const controller of applicationOptions.controllers) {
    const controllerMetadata = MetadataStorage.instance.controllers.find((cMetadata) => cMetadata.target === controller);

    if (!controllerMetadata) {
      throw new Error(`Please decorate ${controller.constructor.name} with @Controller`);
    }

    const controllerRouter = new Router({
      prefix: controllerMetadata.routeName
    });
    createController(controllerMetadata, controllerRouter, applicationOptions);
    applicationRouter.use(controllerRouter.routes());
  }

  /**
   * Catch all route for 404
   */
  if (applicationOptions.globalNotFoundMiddleware) {
    applicationRouter.all('(.*)', useNotFoundMiddleware(applicationOptions.globalNotFoundMiddleware));
  }
}
