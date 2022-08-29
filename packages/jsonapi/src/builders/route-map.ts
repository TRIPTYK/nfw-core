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

export interface RouteInfo { routeName: string, defaultStatus: number, method: HttpMethod, function: (this: {
  instance: unknown,
  meta: RouteMetadataArgs<unknown>,
}, params: JsonApiBuilderRouteParams) => Promise<unknown>, };

export const routeMap: Record<JsonApiMethod, RouteInfo> = {
  [JsonApiMethod.GET_RELATED]: {
    routeName: '/:id/:relation',
    method: HttpMethod.GET,
    function: getRelated,
    defaultStatus: 200
  },
  [JsonApiMethod.GET]: {
    routeName: '/:id',
    method: HttpMethod.GET,
    function: findOne,
    defaultStatus: 200
  },
  [JsonApiMethod.LIST]: {
    routeName: '/',
    method: HttpMethod.GET,
    function: findAll,
    defaultStatus: 200
  },
  [JsonApiMethod.CREATE]: {
    routeName: '/',
    method: HttpMethod.POST,
    function: createOne,
    defaultStatus: 201
  },
  [JsonApiMethod.DELETE]: {
    routeName: '/:id',
    method: HttpMethod.DELETE,
    function: deleteOne,
    defaultStatus: 204
  },
  [JsonApiMethod.UPDATE]: {
    routeName: '/:id',
    method: HttpMethod.PATCH,
    function: updateOne,
    defaultStatus: 200
  },
  [JsonApiMethod.GET_RELATIONSHIPS]: {
    routeName: '/:id/relationships/:relation',
    method: HttpMethod.GET,
    function: getRelationships,
    defaultStatus: 200
  }
}
