/* eslint-disable max-statements */
import type { RouterContext } from '@koa/router';
import Router from '@koa/router';
import type { AnyEntity, EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { Class } from 'type-fest';
import { inject, injectable, container } from '@triptyk/nfw-core';
import pluralize from 'pluralize';
import { MetadataStorage as JsonApiDatastorage } from '../storage/metadata-storage.js';
import type { EndpointMetadataArgs } from '../storage/metadata/endpoint.metadata.js';
import { JsonApiMethod } from '../storage/metadata/endpoint.metadata.js';
import type { ResourceMetadataArgs } from '../storage/metadata/resource.metadata.js';
import type { ResourceMeta } from '../jsonapi.registry.js';
import { JsonApiRegistry } from '../jsonapi.registry.js';
import { ErrorHandler } from '../errors/error-handler.js';
import type { JsonApiControllerOptions } from '../decorators/jsonapi-controller.decorator.js';
import type { RouteInfo } from './route-map.js';
import { routeMap } from './route-map.js';
import type { ControllerActionParamsMetadataArgs } from '../storage/metadata/controller-params.metadata.js';
import type { ResourceDeserializer } from '../deserializers/resource.deserializer.js';
import type { ResourceSerializer } from '../serializers/resource.serializer.js';
import type { ResourceService } from '../services/resource.service.js';
import type { RoleServiceAuthorizer } from '../services/role-authorizer.service.js';
import { NotAcceptableError } from '../errors/not-acceptable.js';
import { UnsupportedMediaTypeError } from '../errors/unsupported-media-type.js';
import { validateContentType } from '../utils/content-type.js';
import type { Next } from 'koa';
import type { RouteMetadataArgs, RouterBuilderInterface } from '@triptyk/nfw-http';
import { middlewaresInstancesForTarget } from '@triptyk/nfw-http';

export interface JsonApiBuilderRouteParams {
  resource: ResourceMeta<any, any>,
  endpoint: EndpointMetadataArgs,
  ctx: RouterContext,
  routeInfo: RouteInfo,
  em: EntityManager,
  routeParams: ControllerActionParamsMetadataArgs[],
  options: JsonApiControllerOptions,
  serializer : ResourceSerializer<any>,
  deserializer: ResourceDeserializer<any>,
  service : ResourceService<any>,
  authorizer? : RoleServiceAuthorizer<any>,
}

@injectable()
export class JsonApiBuilder implements RouterBuilderInterface {
  public declare context: { instance: unknown; meta: RouteMetadataArgs<unknown> };

  public constructor (@inject(JsonApiRegistry) public registry: JsonApiRegistry) {}

  // eslint-disable-next-line class-methods-use-this
  public async bindRouting (parentRouter: Router, router: Router): Promise<void> {
    parentRouter
      .use(router.routes());
  }

  public async build (): Promise<Router> {
    const [entity, options] = this.context.meta.args as any[];

    const resourceMetadataArgs = JsonApiDatastorage.instance.resources.find((v) => v.target === (entity as Class<AnyEntity>));

    if (!resourceMetadataArgs) {
      throw new Error(`Resource not found for controller ${(this.context.instance as Function).name}`);
    }

    const controllerRouter = new Router({
      prefix: `/${pluralize(resourceMetadataArgs.options.entityName)}`
    });

    const resourceMeta = this.registry.resources.get(resourceMetadataArgs.target)!;

    const jsonApiEndpoints = JsonApiDatastorage.instance.endpoints.filter((e) => e.target === this.context.meta.target.prototype);
    const middlewares = middlewaresInstancesForTarget(this.context.meta.target);

    controllerRouter.use(...middlewares);

    /**
     * We patch the entity with defined routes at this moment
     */
    resourceMeta.routes.hasCreate = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.CREATE);
    resourceMeta.routes.hasDelete = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.DELETE);
    resourceMeta.routes.hasGet = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET);
    resourceMeta.routes.hasList = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.LIST);
    resourceMeta.routes.hasRelated = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET_RELATED);
    resourceMeta.routes.hasRelationships = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.GET_RELATIONSHIPS);
    resourceMeta.routes.hasUpdate = jsonApiEndpoints.some((em) => em.method === JsonApiMethod.UPDATE);

    for (const endpoint of jsonApiEndpoints) {
      this.setupJsonApiEndpoint(controllerRouter, endpoint, resourceMetadataArgs, options);
    }

    return controllerRouter;
  }

  public setupJsonApiEndpoint (router: Router, endpoint: EndpointMetadataArgs, resourceMeta: ResourceMetadataArgs<any>, options: JsonApiControllerOptions) {
    const routeInfo = routeMap[endpoint.method];
    const resource = this.registry.resources.get(resourceMeta.target)!;
    const errorHandlerClass = container.resolve(options.errorHandler ?? ErrorHandler);

    const routeParams = JsonApiDatastorage.instance.getParamsFor(endpoint.target);
    const middlewares = middlewaresInstancesForTarget(this.context.meta.target.prototype, endpoint.propertyName);
    const orm = container.resolve(MikroORM);

    /**
   * Resolve before call, they should be singletons
   */
    const serializer = container.resolve(`serializer:${resource.name}`) as ResourceSerializer<any>;
    const deserializer = container.resolve(`deserializer:${resource.name}`) as ResourceDeserializer<any>;
    const service = container.resolve(`service:${resource.name}`) as ResourceService<any>;
    const authorizer = container.resolve('authorizer') as RoleServiceAuthorizer<any> | undefined;

    router[routeInfo.method](routeInfo.routeName, async (ctx: RouterContext, next: Next) => {
      try {
        await next();
      } catch (e: any) {
        await errorHandlerClass.handle(e, ctx);
      }
    }, ...middlewares, async (ctx: RouterContext) => {
      /**
     * Validate content type negociation
     */
      if (!validateContentType(ctx.headers['content-type'] ?? '', endpoint.options?.allowedContentType)) {
        throw new UnsupportedMediaTypeError();
      }
      if (ctx.headers.accept !== 'application/vnd.api+json') {
        throw new NotAcceptableError();
      }

      /** Call each routes */
      const response = await routeInfo.function.call(this.context, {
        resource,
        endpoint,
        routeInfo,
        routeParams,
        options,
        em: orm.em,
        serializer,
        deserializer,
        ctx,
        service,
        authorizer
      });

      ctx.status = routeInfo.defaultStatus;
      ctx.body = response;
      ctx.type = 'application/vnd.api+json';
    });
  }
}
