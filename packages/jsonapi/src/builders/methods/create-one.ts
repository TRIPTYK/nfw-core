import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { UnsupportedMediaTypeError } from '../../errors/unsupported-media-type.js';
import { NotAcceptableError } from '../../errors/not-acceptable.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';
import { UnauthorizedError } from '../../errors/unauthorized.js';

export function createOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, endpoint, routeParams, service, authorizer, deserializer, serializer }: JsonApiBuilderRouteParams) {
  return async (ctx: RouterContext) => {
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

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '', endpoint.options?.allowedContentType, endpoint.options?.ignoreMedia)) {
      throw new UnsupportedMediaTypeError();
    }
    if (ctx.headers.accept !== 'application/vnd.api+json') {
      throw new NotAcceptableError();
    }

    const bodyAsResource = await deserializer.deserialize(((ctx.request as any).body ?? {}) as Record<string, unknown>, jsonApiContext);
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
    let one = await service.createOne(bodyAsResource, jsonApiContext);

    if (authorizer) {
      const can = await authorizer.create(currentUser as any, one, jsonApiContext);
      if (!can) {
        throw new UnauthorizedError();
      }
    }
    await service.repository.persistAndFlush(one as any);
    one = (await service.findOne((one as any).id, jsonApiContext))!;

    const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);

    /**
     * Call the controller's method
     */
    const res : TModel | undefined = await ((this.instance as any)[endpoint.propertyName] as Function).call(this.instance, ...evaluatedParams);

    if (res && !(res instanceof resource.mikroEntity.class)) {
      throw new Error('createOne must return an instance of entity !');
    }

    const finalResponse = res || one;

    const asResource = createResourceFrom(finalResponse.toJSON(), resource, jsonApiContext);

    /**
     * Serialize result and res to client
     */
    const serialized = await serializer.serialize(asResource, jsonApiContext);

    const url = ctx.URL;
    url.pathname += url.pathname.endsWith('/') ? finalResponse.id : `/${finalResponse.id}`;

    ctx.set('Location', url.pathname);
    ctx.body = serialized;
    ctx.status = 201;
    ctx.type = 'application/vnd.api+json';
  }
}
