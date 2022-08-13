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
import type { ControllerActionParamsMetadataArgs } from '../../storage/metadata/controller-params.metadata.js';
import type { EndpointMetadataArgs } from '../../storage/metadata/endpoint.metadata.js';
import { validateContentType } from '../../utils/content-type.js';
import { createResourceFrom } from '../../utils/create-resource.js';
import type { RouteInfo } from '../jsonapi.builder.js';

export function findOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo, routeParams: ControllerActionParamsMetadataArgs[]) {
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
      method: endpointsMeta.method,
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
    await parser.validate(query);
    await parser.parse(query);

    /**
     * Call the service method
     */
    const one = await service.findOne(jsonApiContext);

    if (!one) {
      throw new Error('Not found');
    }

    const evaluatedParams = routeParams.map((rp) => {
      if (rp.decoratorName === 'koa-context') {
        return ctx;
      }

      if (rp.decoratorName === 'jsonapi-context') {
        return jsonApiContext;
      }

      if (rp.decoratorName === 'service-response') {
        return one;
      }

      throw new Error(`Unknown decorator ${rp.decoratorName}`);
    });

    /**
     * Call the controller's method
     */
    const res = await ((this.instance as any)[endpointsMeta.propertyName] as Function).call(this.instance, ...evaluatedParams);

    if (res && !(res instanceof resource.mikroEntity.class)) {
      throw new Error('findOne must return an instance of entity !');
    }

    const asResource = createResourceFrom((res || one).toJSON(), resource, jsonApiContext);

    /**
     * Serialize result and res to client
     */
    const serialized = serializer.serialize(asResource, jsonApiContext);
    ctx.body = serialized;
    ctx.type = 'application/vnd.api+json';
  }
}