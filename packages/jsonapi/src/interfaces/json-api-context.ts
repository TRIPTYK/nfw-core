import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { Resource } from '../resource/base.resource.js';

export interface JsonApiContext<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    koaContext : RouterContext,
    resource: ResourceMeta<TModel, TResource>,
}
