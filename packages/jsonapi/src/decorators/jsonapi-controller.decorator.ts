
import type { Class } from '@triptyk/nfw-core';
import { MetadataStorage, injectable } from '@triptyk/nfw-core';
import { JsonApiBuilder } from '../builders/jsonapi.builder.js';
import type { Resource } from '../resource/base.resource.js';

export function JsonApiController (resource: Class<Resource<unknown>>) {
  return function (target: Class<unknown>) {
    injectable()(target);
    MetadataStorage.instance.routes.push({
      target,
      builder: JsonApiBuilder,
      controllers: [],
      args: resource
    })
  }
}
