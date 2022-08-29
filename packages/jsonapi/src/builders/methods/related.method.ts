import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import { UnauthorizedError } from '../../errors/unauthorized.js';
import { RelationshipNotFoundError } from '../../errors/specific/relationship-not-found.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';

export async function getRelated<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, serializer, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
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
    koaContext: ctx,
    query: parser
  } as JsonApiContext<TModel>;

  const currentUser = await options?.currentUser?.(jsonApiContext);
  const { id, relation } = ctx.params;

  /**
     * Parse the query
     */
  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;
  await parser.validate(query);
  await parser.parse(query);

  const relMeta = resource.relationships.find((r) => r.name === relation);

  if (!relMeta) {
    throw new RelationshipNotFoundError();
  }

  /**
     * Call the service method
     */
  const one = await service.getOneWithRelation(id, jsonApiContext, relation);

  if (!one) {
    throw new ResourceNotFoundError();
  }

  if (authorizer) {
    const can = await authorizer.read(currentUser, one, jsonApiContext);
    if (!can) {
      throw new UnauthorizedError();
    }
  }

  const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);
  /**
     * Call the controller's method
     */
  const res: TModel | undefined = await ((this.instance as Function)[endpoint.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);

  if (res && !(res instanceof resource.mikroEntity.class)) {
    throw new Error('Related must return an instance of entity !');
  }

  const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);

  /**
     * Serialize result and res to client
     */
  return serializer.serialize((asResource as any)[relation], jsonApiContext, undefined, jsonApiContext.query?.includes.get(relation)?.includes);
}
