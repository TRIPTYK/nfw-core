import { subject } from '@casl/ability';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { ForbiddenError } from '../../errors/forbidden.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';

export async function updateOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, serializer, service, authorizer, ctx, deserializer }: JsonApiBuilderRouteParams) {
  /**
     * Resolve instance
     */
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

  const jsonApiContext = {
    resource,
    query: parser,
    method: endpoint.method,
    koaContext: ctx
  } as JsonApiContext<TModel>;

  const currentUser = await options?.currentUser?.(jsonApiContext);
  jsonApiContext.currentUser = currentUser;

  const bodyAsResource = await deserializer.deserialize(((ctx.request as any).body ?? {}) as Record<string, unknown>, jsonApiContext);
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
  let one = await service.updateOne(bodyAsResource, jsonApiContext);

  if (authorizer) {
    const ability = authorizer.buildAbility(currentUser);
    const can = ability.can('update', subject(resource.name, one));
    if (!can) {
      throw new ForbiddenError(`Cannot update ${resource.name}`);
    }
  }

  await service.repository.flush();
  one = (await service.findOne((one as unknown as Record<'id', string>).id, jsonApiContext))!;

  const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);

  /**
     * Call the controller's method
     */
  const res: TModel | undefined = await ((this.instance as Function)[endpoint.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);

  if (res && !(res instanceof resource.mikroEntity.class)) {
    throw new Error('updateOne must return an instance of entity !');
  }

  const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);

  /**
     * Serialize result and res to client
     */
  return serializer.serialize(asResource, jsonApiContext);
}
