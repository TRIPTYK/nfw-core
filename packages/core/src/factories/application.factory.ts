import type { Class } from '../types/class.js';
import type Koa from 'koa';
import { createRoute } from './controller-routing.factory.js';

export interface CreateApplicationOptions {
  /**
   * Controllers
   */
  controllers: Class<unknown>[],
  /**
   * The Koa server app
   */
  server: Koa,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;

  for (const controller of options.controllers) {
    createRoute(app, controller, options);
  }

  return app;
}
