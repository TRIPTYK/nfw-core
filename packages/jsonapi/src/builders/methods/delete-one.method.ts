/* eslint-disable max-statements */
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { executeAuthorizer } from './utils/execute-authorizer.js';
import { callControllerAction } from './utils/call-controller-action.js';

export async function deleteOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  const jsonApiContext = {
    resource,
    method: endpoint.method,
    koaContext: ctx
  } as JsonApiContext<TModel>;

  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;

  await parser.validate(query);
  jsonApiContext.query = await parser.parse(query);
  jsonApiContext.currentUser = await options?.currentUser?.(jsonApiContext);

  const one = await service.deleteOne(jsonApiContext.koaContext.params.id, jsonApiContext);

  await executeAuthorizer(authorizer, 'delete', jsonApiContext, resource, one);

  await service.repository.flush(one);

  return callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, one);
}
