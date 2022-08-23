import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiControllerOptions } from '../../decorators/jsonapi-controller.decorator.js';
import { NotAcceptableError } from '../../errors/not-acceptable.js';
import { UnauthorizedError } from '../../errors/unauthorized.js';
import { UnsupportedMediaTypeError } from '../../errors/unsupported-media-type.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../jsonapi.registry.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { ResourceSerializer } from '../../serializers/resource.serializer.js';
import type { ResourceService } from '../../services/resource.service.js';
import type { RoleServiceAuthorizer } from '../../services/role-authorizer.service.js';
import type { ControllerActionParamsMetadataArgs } from '../../storage/metadata/controller-params.metadata.js';
import type { EndpointMetadataArgs } from '../../storage/metadata/endpoint.metadata.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { RouteInfo } from '../route-map.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';

export function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo, routeParams: ControllerActionParamsMetadataArgs[], options: JsonApiControllerOptions) {
  /**
   * Resolve before call, they should be singletons
   */
  const serializer = container.resolve<ResourceSerializer<TModel>>(`serializer:${resource.name}`) as ResourceSerializer<TModel>;
  const service = container.resolve(`service:${resource.name}`) as ResourceService<TModel>;
  const authorizer = container.resolve(`authorizer:${resource.name}`) as RoleServiceAuthorizer<any, TModel> | undefined;

  return async (ctx: RouterContext) => {
    const parser = container.resolve<QueryParser<TModel>>(endpointsMeta.queryParser ?? QueryParser);

    /**
     * Specific request context
     */
    const jsonApiContext = {
      resource,
      koaContext: ctx,
      method: endpointsMeta.method,
      query: parser
    } as JsonApiContext<TModel>;

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '', options.allowedContentType, options.ignoreMedia)) {
      throw new UnsupportedMediaTypeError();
    }
    if (ctx.headers['content-type'] !== ctx.header.accept) {
      throw new NotAcceptableError();
    }

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
    const [all, count] = await service.findAll(jsonApiContext);

    const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, [all, count]);

    /**
     * Call the controller's method
     */
    const res: TModel[] | undefined = await ((this.instance as Function)[endpointsMeta.propertyName as keyof Function] as Function).call(this.instance, ...evaluatedParams);

    if (res && !Array.isArray(res)) {
      throw new Error('findAll must return an array !');
    }

    const finalServiceResponse = (res || all);

    if (finalServiceResponse.some((v) => !(v instanceof resource.mikroEntity.class))) {
      throw new Error('findAll must return an array of instances of entity !');
    }

    if (authorizer) {
      for (const r of finalServiceResponse) {
        const can = await authorizer.read(currentUser, r, jsonApiContext);
        if (!can) {
          throw new UnauthorizedError();
        }
      }
    }

    /**
     * Transform the result from the service
     */
    const asResource = finalServiceResponse.map((e) => createResourceFrom(e.toObject(), resource, jsonApiContext));

    /**
     * Serialize result and res to client
     */
    const serialized = await serializer.serialize(asResource, jsonApiContext, count);
    ctx.body = serialized;
    // must never change
    ctx.type = 'application/vnd.api+json';
  }
}
