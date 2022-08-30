import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import type { ResourceMeta } from '../jsonapi.registry.js';
import type { QueryParser } from '../query-parser/query-parser.js';
import type { Resource } from '../resource/base.resource.js';
import type { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';

export interface JsonApiContext<TModel extends BaseEntity<TModel, any>, TResource extends Resource<TModel> = Resource<TModel>> {
    koaContext : RouterContext,
    query?: QueryParser<TModel>,
    method: JsonApiMethod,
    currentUser?: any,
    resource: ResourceMeta<TModel, TResource>,
}
