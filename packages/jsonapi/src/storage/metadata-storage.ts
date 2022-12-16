import { singleton } from '@triptyk/nfw-core';
import type { EntityAttributesMetadataArgs } from './metadata/attributes.metadata.js';
import type { ControllerActionParamsMetadataArgs } from './metadata/controller-params.metadata.js';
import type { EndpointMetadataArgs } from './metadata/endpoint.metadata.js';
import type { RelationshipMetadataArgs } from './metadata/relationship.metadata.js';
import type { ResourceMetadataArgs } from './metadata/resource.metadata.js';

@singleton()
export class MetadataStorage {
  public useParams: ControllerActionParamsMetadataArgs[] = [];
  public attributes: EntityAttributesMetadataArgs[] = [];
  public relationships: RelationshipMetadataArgs[] = [];
  public resources: ResourceMetadataArgs<any>[] = [];
  public endpoints: EndpointMetadataArgs[] = [];

  public getAllowedAttributesFor (resource: unknown) {
    return this.attributes.filter((e) => e.target === resource);
  }

  public getAllowedRelationshipsFor (resource: unknown) {
    return this.relationships.filter((e) => e.target === resource);
  }

  public getParamsFor (resource: unknown, propertyName: string) {
    return this.useParams.filter((e) => e.target === resource && e.propertyName === propertyName).sort((a, b) => a.index - b.index);
  }
}
