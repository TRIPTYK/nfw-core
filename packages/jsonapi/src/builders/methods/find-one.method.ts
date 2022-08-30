import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { subject } from '@casl/ability';
import { ForbiddenError } from '../../errors/forbidden.js';

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
    koaContext: ctx,
    query: parser
  } as JsonApiContext<TModel>;

  const currentUser = await options?.currentUser?.(jsonApiContext);
  jsonApiContext.currentUser = currentUser;

  /**
     * Parse the query
     */
  const query = ctx.query as Record<string, any>;
  parser.context = jsonApiContext;
  await parser.validate(query);
  await parser.parse(query);

  /**
     * Call the service method
     */
  const one = await service.findOne(jsonApiContext.koaContext.params.id, jsonApiContext);

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
    throw new Error('findOne must return an instance of entity !');
  }

  const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);
  /**
     * Serialize result and res to client
     */
  return serializer.serialize(asResource, jsonApiContext);
}
