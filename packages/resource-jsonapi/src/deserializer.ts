import { ResourceDeserializer } from 'resources';
import type { Resource } from 'resources';
import JSONAPISerializer from 'json-api-serializer';

export class JsonApiResourceDeserializer<T extends Resource> extends ResourceDeserializer<T> {
  public deserialize (payload: Record<string, unknown>): Promise<T> {
    const serializer = this.createSerializerFromSchema();
    const deserializedPayload = this.deserializeAndWrapRelations(serializer, payload);
    return this.ownRegistry.factory.create(deserializedPayload);
  }

  private deserializeAndWrapRelations (Serializer: JSONAPISerializer, payload: Record<string, unknown>) {
    const deserialized = Serializer.deserialize(this.ownRegistry.schema.type, payload);
    for (const relation in this.ownRegistry.schema.relationships) {
      if (Object.hasOwn(deserialized, relation)) {
        deserialized[relation] = {
          id: deserialized[relation]
        };
      }
    }
    return deserialized;
  }

  private createSerializerFromSchema () {
    const Serializer = new JSONAPISerializer();
    Serializer.register(this.ownRegistry.schema.type);
    return Serializer;
  }
}
