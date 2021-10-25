import Router from '@koa/router';
import { MikroORM } from '@mikro-orm/core'
import Koa from 'koa'
import { Class } from '../types/class.js';
import { createRouting } from './create-routing.js';

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  mikroORMConnection: MikroORM,
  baseRoute: string,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = new Koa();

  const applicationRouter = new Router({
    prefix: options.baseRoute
  });

  createRouting(applicationRouter, options);

  app.use(applicationRouter.routes());

  return app;
}
