import type { EntityAttributesMetadataArgs } from './metadata/attributes.metadata.js';
import type { RelationshipMetadataArgs } from './metadata/relationship.metadata.js';
import type { ResourceMetadataArgs } from './metadata/resource.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  private static _instance?: MetadataStorage;

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

  public attributes: EntityAttributesMetadataArgs[] = [];
  public relationships: RelationshipMetadataArgs[] = [];
  public resources: ResourceMetadataArgs[] = [];
}
