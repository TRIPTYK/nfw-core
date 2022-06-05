import type { ErrorHandlerInterface, GuardInterface } from '../index.js';
import type { Class } from '../types/class.js';
import { createApplicationRouting } from './application-routing.factory.js';
import type Koa from 'koa';
import type { AnyMiddleware } from '../types/any-middleware.js';

interface GuardOptions {
  guard: Class<GuardInterface>,
  args: unknown[],
}

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  server: Koa,
  baseRoute?: `/${string}`,
  globalMiddlewares?: AnyMiddleware[],
  globalGuards?: GuardOptions[],
  globalErrorhandler?: Class<ErrorHandlerInterface>,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;

  await createApplicationRouting(app, options);

  return app;
}
