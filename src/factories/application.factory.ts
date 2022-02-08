import Router from '@koa/router';
import type { MikroORM } from '@mikro-orm/core';
import type { Middleware } from 'koa';
import Koa from 'koa';
import { container } from 'tsyringe';
import type { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import type { ErrorHandlerInterface, GuardInterface } from '../index.js';
import type { Class } from '../types/class.js';
import { createRouting } from './application-routing.factory.js';
import HttpError from 'http-errors';

interface GuardOptions {
  guard: Class<GuardInterface>,
  args: unknown[],
}

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  /**
   * Create an injection in the container with databaseInjectionToken and returns mikroORMConnection
   */
  mikroORMConnection?: MikroORM,
  baseRoute: `/${string}`,
  globalMiddlewares?: (Class<MiddlewareInterface> | Middleware)[],
  globalGuards?: GuardOptions[],
  globalErrorhandler?: Class<ErrorHandlerInterface>,
  globalNotFoundMiddleware?: Class<MiddlewareInterface>,
  /**
   * Apply https://mikro-orm.io/docs/identity-map to each route
   */
  mikroORMContext?: boolean,
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

  /**
   * MikroORM is optionnal
   * Use context for each request for MikroORM, see https://mikro-orm.io/docs/identity-map
   */
  if (options.mikroORMConnection && (options.mikroORMContext ?? true)) {
    try {
      const { RequestContext } = await import('@mikro-orm/core');
      app.use(async (_, next) => {
        await RequestContext.createAsync(options.mikroORMConnection!.em, next);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'An error has been thrown trying to import @mikro-orm, check your dependencies !'
      );
    }
  }

  createRouting(applicationRouter, options);
  app.use(applicationRouter.routes())
  app.use(
    applicationRouter.allowedMethods({
      throw: true,
      notImplemented: () => new HttpError.NotImplemented(),
      methodNotAllowed: () => new HttpError.MethodNotAllowed()
    })
  );

  return app;
}
