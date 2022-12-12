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
import { executeAuthorizer } from './utils/execute-authorizer.js';

export async function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, serializer, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  /**
     * Specific request context
     */
  const jsonApiContext = {
    resource,
    koaContext: ctx,
    method: endpoint.method
  } as JsonApiContext<TModel>;

  /**
   * Parse the query
   */
  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;

  await parser.validate(query);
  jsonApiContext.query = await parser.parse(query);

  jsonApiContext.currentUser = await options?.currentUser?.(jsonApiContext);

  /**
     * Call the service method
     */
  const [all, count] = await service.findAll(jsonApiContext);

  const res: TModel | undefined = await callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, [all, count]);

  if (res && !Array.isArray(res)) {
    throw new Error('findAll must return an array !');
  }

  const finalServiceResponse = (res || all);

  if (finalServiceResponse.some((v) => !(v instanceof resource.mikroEntity.class))) {
    throw new Error('findAll must return an array of instances of entity !');
  }

  if (authorizer) {
    for (const r of finalServiceResponse) {
      await executeAuthorizer(authorizer, 'read', jsonApiContext, resource, r);
    }
  }

  /**
     * Transform the result from the service
     */
  const asResource = finalServiceResponse.map((e) => createResourceFrom(e.toObject(), resource, jsonApiContext));

  /**
     * Serialize result and res to client
     */
  return serializer.serialize(asResource, jsonApiContext, count);
}
