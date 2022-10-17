import { singleton } from 'tsyringe';
import type { RouteMetadataArgs } from './metadata/route.js';

@singleton()
export class MetadataStorage {
  /**
   * Controller Routes decorator metadata
   */
  public routes: RouteMetadataArgs<unknown>[] = [];
}
