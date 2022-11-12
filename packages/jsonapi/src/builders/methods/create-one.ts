/* eslint-disable max-statements */
/* eslint-disable complexity */
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { subject } from '@casl/ability';
import { ForbiddenError } from '../../errors/forbidden.js';
import { validateObject } from './utils/validate.js';
import type { JsonApiCreateOptions } from '../../decorators/jsonapi-endpoints.decorator.js';

export async function createOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, deserializer, endpoint, routeParams, serializer, ctx, service, authorizer }: JsonApiBuilderRouteParams) {
  /**
     * Resolve instance
     */
  const parser = container.resolve<QueryParser<TModel>>(endpoint.options?.queryParser ?? QueryParser);

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

  /**
   * Load Current-User
   */
  const currentUser = await options?.currentUser?.(jsonApiContext);
  jsonApiContext.currentUser = currentUser;

  const bodyAsResource = await deserializer.deserialize(((ctx.request as any).body ?? {}) as Record<string, unknown>, jsonApiContext);

  const createOptions = endpoint.options as JsonApiCreateOptions;

  if (createOptions.validation) {
    // validate only the POJO, we don't want meta properties to be validated
    await validateObject(createOptions.validation, bodyAsResource.toPojo());
  }

  /**
     * Call the service method
     */
  const original = await service.createOne(bodyAsResource, jsonApiContext);

  if (authorizer) {
    const ability = authorizer.buildAbility(jsonApiContext);

    const can = ability.can('create', subject(resource.name, original));
    if (!can) {
      throw new ForbiddenError(`Cannot create ${resource.name}`);
    }
  }

  await service.repository.persistAndFlush(original);
  const fetched = (await service.findOne(original.id, jsonApiContext));

  const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, fetched);

  /**
   * Call the controller's method
   */
  const res : TModel | undefined = await ((this.instance as any)[endpoint.propertyName] as Function).call(this.instance, ...evaluatedParams);

  if (res && !(res instanceof resource.mikroEntity.class)) {
    throw new Error('createOne must return an instance of entity !');
  }

  const finalResponse = res || fetched;

  if (finalResponse) {
    const asResource = createResourceFrom(finalResponse.toJSON(), resource, jsonApiContext);

    const url = ctx.URL;
    url.pathname += url.pathname.endsWith('/') ? original.id : `/${original.id}`;

    ctx.set('Location', url.pathname);

    /**
     * Serialize result and res to client
     */
    return serializer.serialize(asResource, jsonApiContext);
  }
  return undefined;
}
