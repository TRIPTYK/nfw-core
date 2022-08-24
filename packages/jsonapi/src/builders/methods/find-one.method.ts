import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { UnsupportedMediaTypeError } from '../../errors/unsupported-media-type.js';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import { UnauthorizedError } from '../../errors/unauthorized.js';
import { NotAcceptableError } from '../../errors/not-acceptable.js';
import type { JsonApiBuilderRouteParams } from '../jsonapi.builder.js';

export function findOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], { resource, options, routeParams, endpoint, serializer, service, authorizer }: JsonApiBuilderRouteParams) {
  return async (ctx: RouterContext) => {
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

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '', endpoint.options?.allowedContentType, endpoint.options?.ignoreMedia)) {
      throw new UnsupportedMediaTypeError();
    }
    if (ctx.headers.accept !== 'application/vnd.api+json') {
      throw new NotAcceptableError();
    }

    const currentUser = await options?.currentUser?.(jsonApiContext);

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
      const can = await authorizer.read(currentUser as any, one, jsonApiContext);
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
      throw new Error('findOne must return an instance of entity !');
    }

    const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);
    /**
     * Serialize result and res to client
     */
    const serialized = await serializer.serialize(asResource, jsonApiContext);
    ctx.body = serialized;
    ctx.type = 'application/vnd.api+json';
  }
}
