import type { RelationshipSerializerInterface } from '../interfaces/relationship-serializer.js';
import type { RelationshipInterface } from '../interfaces/relationship.js';
import type { ResourceInterface } from '../interfaces/resource.js';
import type { SerializedRelationshipType } from '../types/serialized-relationship.js';

export class RelationshipSerializer implements RelationshipSerializerInterface {
  public constructor (
    private parentResource: ResourceInterface
  ) {}

  public serialize (resource: RelationshipInterface): unknown {
    const relationship: SerializedRelationshipType = {
      links: this.makeLinks(resource.name)
    };
    if (resource.value !== undefined) {
      relationship.data = this.makeData(resource.value);
    }
    return relationship;
  }

  private makeLinks (relationName: string) {
    return {
      self: `/${this.parentResource.getName()}/${this.parentResource.getId()}/relationships/${relationName}`,
      related: `/${this.parentResource.getName()}/${this.parentResource.getId()}/${relationName}`
    };
  }

  private makeData (resource: ResourceInterface | ResourceInterface[] | null) {
    if (resource === null) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }
    if (Array.isArray(resource)) {
      return resource.map((r) => this.makeSingleData(r));
    }
    return this.makeSingleData(resource);
  }

  private makeSingleData (value: ResourceInterface) {
    return { type: value!.getName(), id: value.getId() };
  }
}
