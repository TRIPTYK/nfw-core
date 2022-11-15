import type Koa from 'koa';
import { RouterBuilderFactory } from './controller.js';
import type { Class } from 'type-fest';
import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storages/metadata-storage.js';

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  server: Koa,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;

  for (const controller of options.controllers) {
    const routerBuilder = new RouterBuilderFactory(container.resolve(MetadataStorage), app, controller);
    await routerBuilder.createRoute();
  }
}
