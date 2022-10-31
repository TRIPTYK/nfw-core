import type Koa from 'koa';
import { createRoute } from './controller.js';
import type { Class } from 'type-fest';

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  server: Koa,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;

  for (const controller of options.controllers) {
    createRoute(app, controller, options);
  }

  return app;
}
