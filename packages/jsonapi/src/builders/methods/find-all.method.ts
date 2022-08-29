import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { UnauthorizedError } from '../../errors/unauthorized.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';

export async function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, serializer, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  /**
     * Specific request context
     */
  const jsonApiContext = {
    resource,
    koaContext: ctx,
    method: endpoint.method,
    query: parser
  } as JsonApiContext<TModel>;

  /**
     * Parse the query
     */
  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;
  await parser.validate(query);
  await parser.parse(query);

  const currentUser = await options?.currentUser?.(jsonApiContext);

  /**
     * Call the service method
     */
  const [all, count] = await service.findAll(jsonApiContext);

  const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, [all, count]);

  /**
     * Call the controller's method
     */
  const res: TModel[] | undefined = await ((this.instance as Function)[endpoint.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);

  if (res && !Array.isArray(res)) {
    throw new Error('findAll must return an array !');
  }

  const finalServiceResponse = (res || all);

  if (finalServiceResponse.some((v) => !(v instanceof resource.mikroEntity.class))) {
    throw new Error('findAll must return an array of instances of entity !');
  }

  if (authorizer) {
    for (const r of finalServiceResponse) {
      const can = await authorizer.read(currentUser, r, jsonApiContext);
      if (!can) {
        throw new UnauthorizedError();
      }
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
