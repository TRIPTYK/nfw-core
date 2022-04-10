import Router from '@koa/router';
import { MetadataStorage } from '../storages/metadata-storage.js';
import { resolveMiddleware, useErrorHandler, useNotFoundMiddleware } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createArea } from './area-routing.factory.js';

export function createRouting (applicationRouter: Router, applicationOptions: CreateApplicationOptions) {
  const globalMiddlewaresMeta = applicationOptions.globalMiddlewares ?? [];
  const resolvedMiddlewares = globalMiddlewaresMeta.map(resolveMiddleware);

  if (applicationOptions.globalErrorhandler) {
    resolvedMiddlewares.unshift(useErrorHandler(applicationOptions.globalErrorhandler));
  }

  applicationRouter.use(...resolvedMiddlewares);

  for (const area of applicationOptions.areas) {
    const areaMetadata = MetadataStorage.instance.areas.find((aMetadata) => aMetadata.target === area);

    if (!areaMetadata) {
      throw new Error(`Please decorate ${area.constructor.name} with @Area`);
    }

    const areaRouter = new Router({
      prefix: areaMetadata.routeName
    });
    createArea(areaMetadata, areaRouter, applicationOptions);
    applicationRouter.use(areaRouter.routes(), areaRouter.allowedMethods({
      throw: true
    }));
  }

  /**
   * Catch all route for 404
   */
  if (applicationOptions.globalNotFoundMiddleware) {
    applicationRouter.all('(.*)', useNotFoundMiddleware(applicationOptions.globalNotFoundMiddleware));
  }
}
