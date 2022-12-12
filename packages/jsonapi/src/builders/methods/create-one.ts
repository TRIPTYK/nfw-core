/* eslint-disable max-statements */
/* eslint-disable complexity */
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import type { JsonApiCreateOptions } from '../../decorators/jsonapi-endpoints.decorator.js';
import { executeAuthorizer } from './utils/execute-authorizer.js';
import { validateOneControllerResponse } from './utils/validate-controller-response.js';
import { callControllerAction } from './utils/call-controller-action.js';

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

  if (createOptions.validateFunction) {
    await createOptions.validateFunction(bodyAsResource, jsonApiContext);
  }

  /**
     * Call the service method
     */
  const original = await service.createOne(bodyAsResource, jsonApiContext);

  await executeAuthorizer(authorizer, 'create', jsonApiContext, resource, original);

  await service.repository.persistAndFlush(original);
  const fetched = (await service.findOne(original.id, jsonApiContext));

  const res: TModel | undefined = await callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, fetched);

  validateOneControllerResponse(res, resource);

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
