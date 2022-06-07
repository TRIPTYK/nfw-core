import type Router from '@koa/router';
import type { ControllerMetadataArgs } from 'src/storages/metadata/controller.metadata.js';
import type { RouteMetadataArgs } from 'src/storages/metadata/route.metadata.js';

export interface BuilderMetadata {
    controllerMetadata: ControllerMetadataArgs,
    controllerRouter: Router,
    controllerInstance: unknown,
    routeMetadata: RouteMetadataArgs,
}

export interface BuilderInterface {
    metadata: BuilderMetadata,
    buildRoute(): Promise<Router>,
    buildEndpoint(): Promise<unknown>,
}
