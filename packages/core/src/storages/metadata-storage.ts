import type { RouteMetadataArgs } from './metadata/route.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  private static _instance?: MetadataStorage;

  /**
   * Controller Routes decorator metadata
   */
  public routes: RouteMetadataArgs<unknown>[] = [];

  public static get instance () {
    if (MetadataStorage._instance) {
      return MetadataStorage._instance;
    }
    return (MetadataStorage._instance = new MetadataStorage());
  }

  /**
   * Clear the MetadataStorage instance which is often useless after CreateApplication
   */
  public static clear () {
    this._instance = undefined;
  }
}
