import type Router from '@koa/router';
import type Application from 'koa';
import type { RouteMetadataArgs } from '../storages/metadata/route.js';

export interface RouterBuilderInterface {
    context: {
        instance: unknown,
        meta: RouteMetadataArgs<unknown>,
    },
    build() : Promise<Router>,
    bindRouting(parentRouter: Router | Application, router: Router) : Promise<void>,
}
