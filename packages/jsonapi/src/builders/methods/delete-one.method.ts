import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiControllerOptions } from '../../decorators/jsonapi-controller.decorator.js';
import { UnsupportedMediaTypeError } from '../../errors/unsupported-media-type.js';
import { ResourceNotFoundError } from '../../errors/specific/resource-not-found.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../jsonapi.registry.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { ResourceService } from '../../services/resource.service.js';
import type { RoleServiceAuthorizer } from '../../services/role-authorizer.service.js';
import type { ControllerActionParamsMetadataArgs } from '../../storage/metadata/controller-params.metadata.js';
import type { EndpointMetadataArgs } from '../../storage/metadata/endpoint.metadata.js';
import { validateContentType } from '../../utils/content-type.js';
import type { RouteInfo } from '../jsonapi.builder.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';
import { UnauthorizedError } from '../../errors/unauthorized.js';

export function deleteOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo, routeParams: ControllerActionParamsMetadataArgs[], options: JsonApiControllerOptions) {
  /**
   * Resolve before call, they should be singletons
   */
  const service = container.resolve(`service:${resource.name}`) as ResourceService<TModel>;
  const authorizer = container.resolve(`authorizer:${resource.name}`) as RoleServiceAuthorizer<any, TModel> | undefined;

  return async (ctx: RouterContext) => {
    /**
     * Resolve instance
     */
    const parser = container.resolve<QueryParser<TModel>>(endpointsMeta.queryParser ?? QueryParser);

    /**
     * Specific request context
     */
    const jsonApiContext = {
      resource,
      method: endpointsMeta.method,
      koaContext: ctx,
      query: parser
    } as JsonApiContext<TModel>;

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '')) {
      throw new UnsupportedMediaTypeError();
    }
    if (ctx.headers['content-type'] !== ctx.header.accept) {
      throw new UnsupportedMediaTypeError();
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
      const can = await authorizer.remove(currentUser, one, jsonApiContext);
      if (!can) {
        throw new UnauthorizedError();
      }
    }

    await service.repository.removeAndFlush(one);

    const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);
    /**
     * Call the controller's method
     */
    const res: any = await ((this.instance as Function)[endpointsMeta.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);

    /**
     * Serialize result and res to client
     */
    ctx.body = res;
    ctx.type = 'application/vnd.api+json';
  }
}
