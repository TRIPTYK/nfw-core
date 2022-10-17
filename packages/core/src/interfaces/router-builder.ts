import type Router from '@koa/router';
import type Application from 'koa';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';

export interface RouterBuilderInterface {
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
