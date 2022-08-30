import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { ForbiddenError } from '../../errors/forbidden.js';
import { subject } from '@casl/ability';

export async function deleteOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
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
    const ability = authorizer.buildAbility(currentUser);

    const can = ability.can('delete', subject(resource.name, one));
    if (!can) {
      throw new ForbiddenError(`Cannot delete ${resource.name}`);
    }
  }

  await service.repository.removeAndFlush(one);

  const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);
  /**
     * Call the controller's method
     */
  return ((this.instance as Function)[endpoint.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);
}
