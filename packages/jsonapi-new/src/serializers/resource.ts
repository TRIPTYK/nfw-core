import type { RelationshipInterface } from '../interfaces/relationship.js';
import type { ResourceSerializerInterface } from '../interfaces/resource-serializer.js';
import type { ResourceInterface } from '../interfaces/resource.js';
import type { SerializedResourceType } from '../types/serialized-resource.js';
import { RelationshipSerializer } from './relationship.js';

export class ResourceSerializer implements ResourceSerializerInterface {
  public serialize (resource: ResourceInterface) {
    const relationships = this.serializeRelationships(resource);

    const serialized: SerializedResourceType = {
      type: resource.getName(),
      id: resource.getId(),
      attributes: resource.attributes()
    };

    if (Object.keys(relationships).length > 0) {
      serialized.relationships = relationships;
    }

    return serialized;
  }

  private serializeRelationships (resource: ResourceInterface) {
    const relationships: Record<string, unknown> = {};
    for (const relation of resource.relationships()) {
      relationships[relation.name] = this.serializeRelation(resource, relation);
    }
    return relationships;
  }

  // eslint-disable-next-line class-methods-use-this
  private serializeRelation (resource: ResourceInterface, relation : RelationshipInterface) {
    const relationshipData = new RelationshipSerializer(resource);
    return relationshipData.serialize(relation);
  }
}
