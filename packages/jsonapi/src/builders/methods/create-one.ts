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
import { validateOneControllerResponse } from './utils/validate-controller-response.js';
import { callControllerAction } from './utils/call-controller-action.js';

export async function createOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, deserializer, endpoint, routeParams, serializer, ctx }: JsonApiBuilderRouteParams) {
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

  const bodyAsResource = await deserializer.deserialize(((ctx.request as any).body ?? {}) as Record<string, unknown>, jsonApiContext);

  const createOptions = endpoint.options as JsonApiCreateOptions;

  if (createOptions.validateFunction) {
    await createOptions.validateFunction(bodyAsResource, jsonApiContext);
  }

  const res: any | undefined = await callControllerAction(this.instance, endpoint.propertyName as never, routeParams, jsonApiContext, bodyAsResource);

  validateOneControllerResponse(res, resource);

  if (res) {
    const asResource = createResourceFrom(res.toJSON(), resource, jsonApiContext);

    const url = ctx.URL;
    url.pathname += url.pathname.endsWith('/') ? res.id : `/${res.id}`;

    ctx.set('Location', url.pathname);

    /**
     * Serialize result and res to client
     */
    return serializer.serialize(asResource, jsonApiContext);
  }
  return undefined;
}
