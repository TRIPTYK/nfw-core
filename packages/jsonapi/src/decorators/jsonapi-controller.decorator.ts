
import type { BaseEntity } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { injectable, container } from '@triptyk/nfw-core';
import { JsonApiBuilder } from '../builders/jsonapi.builder.js';
import type { JsonApiContext } from '../interfaces/json-api-context.js';
import type { ErrorHandler } from '../errors/error-handler.js';
import { MetadataStorage } from '@triptyk/nfw-http';

export interface JsonApiControllerOptions {
  currentUser?: <TModel extends BaseEntity<TModel, any>>(context: JsonApiContext<any>) => Promise<TModel>,
  errorHandler?: Class<ErrorHandler>,
}

export function JsonApiController (resource: Class<any>, options?: JsonApiControllerOptions) {
  return function (target: Class<unknown>) {
    injectable()(target);
    container.resolve(MetadataStorage).routes.push({
      target,
      builder: JsonApiBuilder,
      controllers: [],
      args: [resource, options ?? {}]
    });
  };
}
