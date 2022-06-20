import type { RouterContext } from '@koa/router';
import type { ResourceMeta } from '../jsonapi.registry.js';

export interface JsonApiContext<T> {
    koaContext : RouterContext,
    resource: ResourceMeta,
}
