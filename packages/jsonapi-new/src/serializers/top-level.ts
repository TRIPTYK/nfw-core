// eslint-disable-next-line max-classes-per-file
import type { RegistryInterface } from '../interfaces/registry.js';
import type { ResourceInterface } from '../interfaces/resource.js';
import type { TopLevelSerializerInterface } from '../interfaces/top-level-serializer.js';
import type { SerializedResourceType } from '../types/serialized-resource.js';

export class TopLevelSerializer implements TopLevelSerializerInterface {
  public constructor (
    public registry : RegistryInterface
  ) {}

  public serialize (resource: ResourceInterface | ResourceInterface[] | null) {
    const included = new Map();
    return {
      data: this.makeData(resource, included),
      included: Array.from(included.values())
    };
  }

  private makeData (resource: ResourceInterface | ResourceInterface[] | null, included: Map<string, SerializedResourceType>) {
    if (resource === null) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }
    if (Array.isArray(resource)) {
      return resource.map((r) => this.serializeOneResource(r, included));
    }
    return this.serializeOneResource(resource, included);
  }

  // eslint-disable-next-line max-statements
  private serializeOneResource (resource: ResourceInterface, included: Map<string, SerializedResourceType>) {
    const serialized = this.serializeResource(resource);
    for (const relationship of resource.relationships()) {
      if (relationship.value !== undefined) {
        this.makeData(relationship.value, included);
      }
    }
    return serialized;
  }

  private serializeResource (resource: ResourceInterface) {
    const serializer = this.registry.serializerFor(resource.getName());
    return serializer!.serialize(resource);
  }
}
