import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import { RelationshipNotFoundError } from '../../errors/specific/relationship-not-found.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { subject } from '@casl/ability';
import { ForbiddenError } from '../../errors/forbidden.js';

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
    koaContext: ctx
  } as JsonApiContext<TModel>;

  /**
   * Parse the query
   */
  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;

  await parser.validate(query);
  jsonApiContext.query = await parser.parse(query);

  const currentUser = await options?.currentUser?.(jsonApiContext);
  jsonApiContext.currentUser = currentUser;
  const { id, relation } = ctx.params;

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
    const ability = authorizer.buildAbility(jsonApiContext);

    const can = ability.can('read', subject(resource.name, one));
    if (!can) {
      throw new ForbiddenError(`Cannot read ${resource.name}`);
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
