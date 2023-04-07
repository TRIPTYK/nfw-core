
import type { RelationshipOptions } from 'json-api-serializer';
import JSONAPISerializer from 'json-api-serializer';
import type { Resource, ResourceDeserializer, ResourceProperties, ResourceSchema, SchemaRelationship, ResourcesRegistry } from 'resources';
import { deserializationSchema, deserialize } from 'resources';

export class JsonApiResourceDeserializer<T extends Resource> implements ResourceDeserializer<T> {
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {

  }

  get schema () {
    return deserializationSchema(this.registry.getSchemaFor(this.type));
  }

  public async deserialize (payload: Record<string, unknown>): Promise<Partial<ResourceProperties<T>>> {
    const serializer = this.createSerializerFromSchema();
    const deserialized = serializer.deserialize(this.type, payload);
    return deserialize(deserialized, this.schema as never);
  }

  private createSerializerFromSchema () {
    const relationships = this.formatRelationships(this.schema);

    const Serializer = new JSONAPISerializer();
    Serializer.register(this.type, {
      whitelistOnDeserialize: Object.keys(this.schema.attributes),
      relationships
    });
    return Serializer;
  }

  private formatRelationships (schema: ResourceSchema<Resource>) {
    return Object.entries(schema.relationships).reduce((c, [relationName, relationDescriptor], i) => {
      c[relationName] = {
        type: (relationDescriptor as SchemaRelationship).type
      } as RelationshipOptions;
      return c;
    }, {} as Record<string, RelationshipOptions>);
  }
}
