import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiControllerOptions } from '../../decorators/jsonapi-controller.decorator.js';
import { UnsupportedMediaTypeError } from '../../errors/specific/bad-content-type.js';
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
import type { RouteInfo } from '../jsonapi.builder.js';
import { getRouteParamsFromContext } from './utils/evaluate-route-params.js';

export function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo, routeParams: ControllerActionParamsMetadataArgs[], options: JsonApiControllerOptions) {
  /**
   * Resolve before call, they should be singletons
   */
  const serializer = container.resolve<ResourceSerializer<TModel>>(`serializer:${resource.name}`) as ResourceSerializer<TModel>;
  const service = container.resolve(`service:${resource.name}`) as ResourceService<TModel>;
  const authorizer = container.resolve(`authorizer:${resource.name}`) as RoleServiceAuthorizer<TModel, any> | undefined;

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
    if (!validateContentType(ctx.headers['content-type'] ?? '')) {
      throw new UnsupportedMediaTypeError();
    }
    if (ctx.headers['content-type'] !== ctx.header.accept) {
      throw new UnsupportedMediaTypeError();
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
    const res = await ((this.instance as InstanceType<any>)[endpointsMeta.propertyName] as Function).call(this.instance, ...evaluatedParams);

    if (res && !Array.isArray(res)) {
      throw new Error('findAll must return an array !');
    }

    if (authorizer) {
      for (const r of res) {
        const can = await authorizer.read(currentUser as any, r, jsonApiContext);
        if (!can) {
          throw new Error('Unauthorized');
        }
      }
    }

    /**
     * Transform the result from the service
     */
    const asResource = (res || all).map((e: any) => createResourceFrom(e.toObject(), resource, jsonApiContext));

    /**
     * Serialize result and res to client
     */
    const serialized = serializer.serialize(asResource, jsonApiContext, count);
    ctx.body = serialized;
    // must never change
    ctx.type = 'application/vnd.api+json';
  }
}
