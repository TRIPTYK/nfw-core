import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import { BadContentTypeError } from '../../errors/specific/bad-content-type.js';
import type { JsonApiContext } from '../../interfaces/json-api-context.js';
import type { ResourceMeta } from '../../jsonapi.registry.js';
import { QueryParser } from '../../query-parser/query-parser.js';
import type { ResourceSerializer } from '../../serializers/resource.serializer.js';
import type { ResourceService } from '../../services/resource.service.js';
import type { EndpointMetadataArgs } from '../../storage/metadata/endpoint.metadata.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { RouteInfo } from '../jsonapi.builder.js';

export function findAll<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo) {
  /**
   * Resolve before call, they should be singletons
   */
  const serializer = container.resolve<ResourceSerializer<TModel>>(`serializer:${resource.name}`) as ResourceSerializer<TModel>;
  const service = container.resolve(`service:${resource.name}`) as ResourceService<TModel>;

  return async (ctx: RouterContext) => {
    /**
     * Specific request context
     */
    const jsonApiContext = {
      resource,
      koaContext: ctx
    } as JsonApiContext<TModel>;

    /**
     * Resolve instance
     */
    const parser = container.resolve<QueryParser<TModel>>(endpointsMeta.queryParser ?? QueryParser);

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '')) {
      throw new BadContentTypeError();
    }
    if (ctx.headers['content-type'] !== ctx.header.accept) {
      throw new BadContentTypeError();
    }

    /**
     * Parse the query
     */
    const query = ctx.query as Record<string, any>;
    parser.context = jsonApiContext;
    parser.parse(query);

    /**
     * Call the service method
     */
    const all = await service.findAll(parser, jsonApiContext);

    /**
     * Transform the result from the service
     */
    const asResource = all.map((e: any) => createResourceFrom(e.toJSON(), resource));

    /**
     * Call the controller's method
     */
    const res = await ((this.instance as any)[endpointsMeta.propertyName] as Function).call(this.instance);

    /**
     * Serialize result and res to client
     */
    const serialized = serializer.serialize(asResource, jsonApiContext);
    ctx.body = serialized;
    ctx.type = 'application/vnd.api+json';
  }
}
