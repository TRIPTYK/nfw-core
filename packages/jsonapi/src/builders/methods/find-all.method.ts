/* eslint-disable max-statements */
/* eslint-disable complexity */
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { callControllerAction } from './utils/call-controller-action.js';

export async function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, endpoint, routeParams, serializer, ctx }: JsonApiBuilderRouteParams) {
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  const jsonApiContext = {
    resource,
    koaContext: ctx,
    method: endpoint.method
  } as JsonApiContext<TModel>;

  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;

  await parser.validate(query);
  jsonApiContext.query = await parser.parse(query);

  const [models, count]: [TModel[], number] = await callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, undefined);

  const asResource = models.map((e) => createResourceFrom(e.toObject(), resource, jsonApiContext));

  return serializer.serialize(asResource, jsonApiContext, count);
}
