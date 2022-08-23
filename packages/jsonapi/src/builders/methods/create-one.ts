import type { RouterContext } from '@koa/router';
import type { BaseEntity } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import type { HttpBuilder } from '@triptyk/nfw-http';
import type { JsonApiControllerOptions } from '../../decorators/jsonapi-controller.decorator.js';
import type { ResourceDeserializer } from '../../deserializers/resource.deserializer.js';
import { UnsupportedMediaTypeError } from '../../errors/unsupported-media-type.js';
import { NotAcceptableError } from '../../errors/not-acceptable.js';
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

export function createOne<TModel extends BaseEntity<TModel, any>> (this: HttpBuilder['context'], resource: ResourceMeta<TModel>, endpointsMeta: EndpointMetadataArgs, routeInfo: RouteInfo, routeParams: ControllerActionParamsMetadataArgs[], options: JsonApiControllerOptions) {
  /**
   * Resolve before call, they should be singletons
   */
  const serializer = container.resolve<ResourceSerializer<TModel>>(`serializer:${resource.name}`) as ResourceSerializer<TModel>;
  const deserializer = container.resolve<ResourceDeserializer<TModel>>(`deserializer:${resource.name}`) as ResourceDeserializer<TModel>;
  const service = container.resolve(`service:${resource.name}`) as ResourceService<TModel>;
  const authorizer = container.resolve(`authorizer:${resource.name}`) as RoleServiceAuthorizer<TModel, any> | undefined;

  return async (ctx: RouterContext) => {
    /**
     * Resolve instance
     */
    const parser = container.resolve<QueryParser<TModel>>(endpointsMeta.queryParser ?? QueryParser);

    const jsonApiContext = {
      resource,
      query: parser,
      method: endpointsMeta.method,
      koaContext: ctx
    } as JsonApiContext<TModel>;

    /**
     * Validate content type negociation
     */
    if (!validateContentType(ctx.headers['content-type'] ?? '', options.allowedContentType, options.ignoreMedia)) {
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

    await bodyAsResource.validate();

    const currentUser = await options?.currentUser?.(jsonApiContext);

    /**
     * Call the service method
     */
    let one = await service.createOne(bodyAsResource, jsonApiContext);

    if (authorizer) {
      const can = await authorizer.create(currentUser as any, one, jsonApiContext);
      if (!can) {
        throw new Error('Unauthorized');
      }
    }
    await service.repository.persistAndFlush(one as any);
    one = (await service.findOne((one as any).id, jsonApiContext))!;

    const evaluatedParams = getRouteParamsFromContext(routeParams, ctx, jsonApiContext, one);

    /**
     * Call the controller's method
     */
    const res : TModel | undefined = await ((this.instance as any)[endpointsMeta.propertyName] as Function).call(this.instance, ...evaluatedParams);

    if (res && !(res instanceof resource.mikroEntity.class)) {
      throw new Error('createOne must return an instance of entity !');
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
