import Router from '@koa/router';
import { MikroORM } from '@mikro-orm/core'
import Koa, { Middleware } from 'koa'
import { container } from 'tsyringe';
import { MiddlewareInterface } from '../interfaces/middleware.interface.js'
import { ErrorHandlerInterface, GuardInterface } from '../index.js';
import { Class } from '../types/class.js';
import { createRouting } from './create-application-routing.factory.js';

interface GuardOptions {
  guard: Class<GuardInterface>,
  args: unknown[],
}

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  mikroORMConnection: MikroORM,
  baseRoute: string,
  globalMiddlewares?: (Class<MiddlewareInterface> | Middleware)[],
  globalGuards?: GuardOptions[],
  globalErrorhandler?: Class<ErrorHandlerInterface>,
  globalNotFoundMiddleware?: Class<MiddlewareInterface>,
}

export const databaseInjectionToken = Symbol('database-connection');

export async function createApplication (options: CreateApplicationOptions) {
  const app = new Koa();

  const applicationRouter = new Router({
    prefix: options.baseRoute
  });

  container.register(databaseInjectionToken, {
    useValue: options.mikroORMConnection
  });

  createRouting(applicationRouter, options);
  app.use(applicationRouter.routes());

  return app;
}
