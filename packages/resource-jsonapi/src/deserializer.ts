
import type { RelationshipOptions } from 'json-api-serializer';
import JSONAPISerializer from 'json-api-serializer';
import { ResourceSchema, SchemaRelationship } from './interfaces/schema';
import { ResourcesRegistry } from './registry/registry';
import { ResourceProperties } from './types/resource-properties';

export class JsonApiResourceDeserializer<T> {
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {

  }

  get schema () {
    return this.registry.getSchemaFor(this.type) as ResourceSchema<Record<string, unknown>>;
  }

  public async deserialize (payload: Record<string, unknown>): Promise<Partial<T>> {
    const serializer = this.createSerializerFromSchema();
    return serializer.deserialize(this.type, payload);
  }

  private createSerializerFromSchema () {
    const relationships = this.formatRelationships();

    const Serializer = new JSONAPISerializer();
    Serializer.register(this.type, {
      whitelistOnDeserialize: Object.keys(this.schema.attributes),
      relationships
    });
    return Serializer;
  }

  private formatRelationships () {
    return Object.entries(this.schema.relationships).reduce((c, [relationName, relationDescriptor], i) => {
      c[relationName] = {
        type: (relationDescriptor as SchemaRelationship).type
      } as RelationshipOptions;
      return c;
    }, {} as Record<string, RelationshipOptions>);
  }
}
