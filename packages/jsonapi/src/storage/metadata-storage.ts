import type { EntityAttributesMetadataArgs } from './metadata/attributes.metadata.js';
import type { ControllerActionParamsMetadataArgs } from './metadata/controller-params.metadata.js';
import type { EndpointMetadataArgs } from './metadata/endpoint.metadata.js';
import type { RelationshipMetadataArgs } from './metadata/relationship.metadata.js';
import type { ResourceMetadataArgs } from './metadata/resource.metadata.js';

export class MetadataStorage {
  /**
   * Singleton
   */
  private static _instance?: MetadataStorage;

  public useParams: ControllerActionParamsMetadataArgs[] = [];
  public attributes: EntityAttributesMetadataArgs[] = [];
  public relationships: RelationshipMetadataArgs[] = [];
  public resources: ResourceMetadataArgs<any>[] = [];
  public endpoints: EndpointMetadataArgs[] = [];

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

  public getAllowedAttributesFor (resource: unknown) {
    return this.attributes.filter((e) => e.target === resource);
  }

  public getAllowedRelationshipsFor (resource: unknown) {
    return this.relationships.filter((e) => e.target === resource);
  }

  public getParamsFor (resource: unknown) {
    return this.useParams.filter((e) => e.target === resource).sort((a, b) => a.index - b.index);
  }
}
