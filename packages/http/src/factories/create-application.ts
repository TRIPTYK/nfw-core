import type Koa from 'koa';
import { RouterBuilder } from '../routing/router-builder.js';
import type { Class } from 'type-fest';
import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storages/metadata-storage.js';

export interface CreateApplicationOptions {
  controllers: Class<unknown>[],
  server: Koa,
}

export async function createApplication (options: CreateApplicationOptions) {
  const app = options.server;
  const metadataStorage = container.resolve(MetadataStorage);

  for (const controller of options.controllers) {
    const routerBuilder = new RouterBuilder(metadataStorage, app, controller);
    await routerBuilder.createRoute();
  }
}
