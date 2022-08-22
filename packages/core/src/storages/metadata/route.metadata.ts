import type Router from '@koa/router';
import type Application from 'koa';
import type { Class } from 'type-fest';

export interface RouteBuilderInterface {
    context: {
        instance: unknown,
        meta: RouteMetadataArgs<unknown>,
    },
    /**
     * Build the routing
     */
    build() : Promise<Router>,
    /**
     * After all endpoints and sub-routers have been built
     */
    bindRouting(parentRouter: Router | Application, router: Router) : Promise<void>,
}

export interface RouteMetadataArgs<T> {
    target: Class<unknown>,
    controllers?: Class<unknown>[],
    args: T,
    builder: Class<RouteBuilderInterface>,
}
