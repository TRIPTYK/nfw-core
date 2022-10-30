import { singleton } from 'tsyringe';
import { RouterMetadataNotFoundError } from '../errors/router-metadata-not-found.js';
import type { RouteMetadataArgs } from './metadata/route.js';

@singleton()
export class MetadataStorage {
  public routes: RouteMetadataArgs<unknown>[] = [];

  public findRouteForTarget (target: unknown) {
    const route = this.routes.find((controllerMeta) => controllerMeta.target === target);

    if (!route) {
      throw new RouterMetadataNotFoundError();
    }

    return route;
  }
}
