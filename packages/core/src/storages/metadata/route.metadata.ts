import type Router from '@koa/router';
import type Application from 'koa';
import type { Class } from '../../types/class.js';
import type { EndpointMetadataArgs } from './endpoint.metadata.js';
import type { UseMiddlewareMetadataArgs } from './use-middleware.metadata.js';

export interface EndpointMetaParams {
    endpointMiddlewaresMeta: UseMiddlewareMetadataArgs[],
    endpointMeta: EndpointMetadataArgs,
 }

export interface RouteBuilderInterface {
    context: {
        instance: unknown,
        meta: RouteMetadataArgs<unknown>,
    },
    /**
     * Build the router
     */
    build({ controllerMiddlewaresMeta } : { controllerMiddlewaresMeta: UseMiddlewareMetadataArgs[] }) : Promise<Router>,

    /**
     *
     */
    endpoint(router: Router, params : EndpointMetaParams) : Promise<void>,
    /**
     * After all endpoints and sub-routers have been built
     */
    routing(parentRouter: Router | Application, router: Router) : Promise<void>,
}

export interface RouteMetadataArgs<T> {
    target: Class<unknown>,
    controllers?: Class<unknown>[],
    args: T,
    builder: Class<RouteBuilderInterface>,
}
