
import type { BaseEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { MetadataStorage, injectable } from '@triptyk/nfw-core';
import { JsonApiBuilder } from '../builders/jsonapi.builder.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';

export interface JsonApiControllerOptions {
  currentUser?: <TModel extends BaseEntity<TModel, any>>(context: JsonApiContext<any>) => Promise<TModel>,
}

export function JsonApiController (resource: Class<any>, options?: JsonApiControllerOptions) {
  return function (target: Class<unknown>) {
    injectable()(target);
    MetadataStorage.instance.routes.push({
      target,
      builder: JsonApiBuilder,
      controllers: [],
      args: [resource, options]
    })
  }
}
