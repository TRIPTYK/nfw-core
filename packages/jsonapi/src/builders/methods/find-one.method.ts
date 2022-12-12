/* eslint-disable complexity */
/* eslint-disable max-statements */
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { executeAuthorizer } from './utils/execute-authorizer.js';
import { validateOneControllerResponse } from './utils/validate-controller-response.js';
import { callControllerAction } from './utils/call-controller-action.js';

export async function findOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, serializer, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
  /**
     * Resolve instance
     */
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  /**
     * Specific request context
     */
  const jsonApiContext = {
    resource,
    method: endpoint.method,
    koaContext: ctx
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
  const one = await service.findOne(jsonApiContext.koaContext.params.id, jsonApiContext);

  await executeAuthorizer(authorizer, 'read', jsonApiContext, resource, one);

  const res: TModel | undefined = await callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, one);

  validateOneControllerResponse(res, resource);

  const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);
  /**
     * Serialize result and res to client
     */
  return serializer.serialize(asResource, jsonApiContext);
}
