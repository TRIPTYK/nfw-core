import type { RouterContext } from '@koa/router';
import type { RouteMetadataArgs } from '@triptyk/nfw-core';
import { HttpMethod } from '@triptyk/nfw-http';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';
import type { JsonApiBuilderRouteParams } from './jsonapi.builder.js';
import { createOne } from './methods/create-one.js';
import { deleteOne } from './methods/delete-one.method.js';
import { findAll } from './methods/find-all.method.js';
import { findOne } from './methods/find-one.method.js';
import { getRelated } from './methods/related.method.js';
import { getRelationships } from './methods/relationships.method.js';
import { updateOne } from './methods/update-one.method.js';

export interface RouteInfo { routeName: string, method: HttpMethod, function: (this: {
  instance: unknown,
  meta: RouteMetadataArgs<unknown>,
}, params: JsonApiBuilderRouteParams) => (ctx: RouterContext) => Promise<void>, };

export const routeMap: Record<JsonApiMethod, RouteInfo> = {
  [JsonApiMethod.GET_RELATED]: {
    routeName: '/:id/:relation',
    method: HttpMethod.GET,
    function: getRelated
  },
  [JsonApiMethod.GET]: {
    routeName: '/:id',
    method: HttpMethod.GET,
    function: findOne
  },
  [JsonApiMethod.LIST]: {
    routeName: '/',
    method: HttpMethod.GET,
    function: findAll
  },
  [JsonApiMethod.CREATE]: {
    routeName: '/',
    method: HttpMethod.POST,
    function: createOne
  },
  [JsonApiMethod.DELETE]: {
    routeName: '/:id',
    method: HttpMethod.DELETE,
    function: deleteOne
  },
  [JsonApiMethod.UPDATE]: {
    routeName: '/:id',
    method: HttpMethod.PATCH,
    function: updateOne
  },
  [JsonApiMethod.GET_RELATIONSHIPS]: {
    routeName: '/:id/relationships/:relation',
    method: HttpMethod.GET,
    function: getRelationships
  }
}
