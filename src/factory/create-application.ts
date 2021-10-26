import Router from '@koa/router';
import { MikroORM } from '@mikro-orm/core'
import Koa from 'koa'
import { container } from 'tsyringe';
import { GuardInterface, MiddlewareInteface } from '../index.js';
import { Class } from '../types/class.js';
import { createRouting } from './create-routing.js';

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  mikroORMConnection: MikroORM,
  baseRoute: string,
  globalMiddlewares?: MiddlewareInteface[],
  globalGuards?: GuardInterface[],
  globalErrorhandler?: MiddlewareInteface,
  globalNotFoundHandler?: MiddlewareInteface,
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
