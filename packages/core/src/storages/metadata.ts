import { singleton } from 'tsyringe';
import type { RouteMetadataArgs } from './metadata/route.js';

@singleton()
export class MetadataStorage {
  public routes: RouteMetadataArgs<unknown>[] = [];
}
