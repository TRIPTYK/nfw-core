import type { MikroORM } from '@mikro-orm/core';
import type { Middleware } from 'koa';
import { container } from 'tsyringe';
import type { MiddlewareInterface } from '../interfaces/middleware.interface.js';
import type { ErrorHandlerInterface, GuardInterface } from '../index.js';
import type { Class } from '../types/class.js';
import { createRouting } from './application-routing.factory.js';
import type Koa from 'koa';
import { MetadataStorage } from '../storages/metadata-storage.js';

interface GuardOptions {
  guard: Class<GuardInterface>,
  args: unknown[],
}

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  /**
   * Create an injection in the container with databaseInjectionToken and returns mikroORMConnection
   */
  server: Koa,
  mikroORMConnection?: MikroORM,
  baseRoute: `/${string}`,
  globalMiddlewares?: (Class<MiddlewareInterface> | Middleware)[],
  globalGuards?: GuardOptions[],
  globalErrorhandler?: Class<ErrorHandlerInterface>,
  /**
   * Apply https://mikro-orm.io/docs/identity-map to each route
   */
  mikroORMContext?: boolean,
}

export const databaseInjectionToken = Symbol('database-connection');

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;

  container.register(databaseInjectionToken, {
    useValue: options.mikroORMConnection
  });
  /**
   * MikroORM is optionnal
   * Use context for each request for MikroORM, see https://mikro-orm.io/docs/identity-map
   */
  if (options.mikroORMConnection && (options.mikroORMContext ?? true)) {
    const { RequestContext } = await import('@mikro-orm/core');
    app.use(async (_, next) => {
      await RequestContext.createAsync(options.mikroORMConnection!.em, next);
    });
  }

  createRouting(app, options);

  MetadataStorage.clear();

  return app;
}
