import Router from '@koa/router';
import type Application from 'koa';
import { allowedMethods } from '../utils/allowed-methods.util.js';
import { resolveMiddleware, useErrorHandler } from '../utils/factory.util.js';
import type { CreateApplicationOptions } from './application.factory.js';
import { createController } from './controller-routing.factory.js';

export function createRouting (app: Application, applicationOptions: CreateApplicationOptions) {
  const applicationRouter = new Router({
    prefix: applicationOptions.baseRoute
  });

  const resolvedMiddlewares = (applicationOptions.globalMiddlewares ?? []).map(resolveMiddleware);

  if (applicationOptions.globalErrorhandler) {
    resolvedMiddlewares.unshift(useErrorHandler(applicationOptions.globalErrorhandler));
  }

  applicationRouter.use(...resolvedMiddlewares);

  for (const controller of applicationOptions.controllers) {
    createController(applicationRouter, controller, applicationOptions);
  }

  app.use(applicationRouter.routes())
  app.use(
    allowedMethods(applicationRouter)
  );
}
