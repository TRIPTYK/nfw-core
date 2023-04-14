import { IncorrectTypeError } from '../errors/incorrect-type.js';
import type { ResourceSchema } from '../interfaces/schema.js';

type deserializedPayload = Record<keyof ResourceSchema['attributes'] | keyof ResourceSchema['relationships'], unknown>;

//SchemaApplyer filter field + type assert
export class JsonApiDeserializer {
  copy: deserializedPayload = {};

	//user generic for ResourceSchema
  constructor (private payload: Record<string, unknown>, private schema: ResourceSchema) {}

  deserialize (): deserializedPayload {
    for (const key in this.payload) {
      this.deserializePayloadKey(key);
    }
    return this.copy;
  }

  private deserializePayloadKey (key: string) {
    if (this.isPayloadKeySerializable(key)) {
      this.copy[key] = this.payload[key];
    }
  }

  private isPayloadKeySerializable (key: string) {
    this.assertPayloadValueType(key);
    const serializable = this.schema.attributes[key] ?? this.schema.relationships[key];
    return serializable && serializable.deserialize;
  }

  private assertPayloadValueType (key: string) {
    const serializableAttribute = this.schema.attributes[key];
    if (serializableAttribute !== undefined && typeof this.payload[key] !== serializableAttribute.type) {
      throw new IncorrectTypeError(`${key} of type ${typeof this.payload[key]} is not allowed, type ${serializableAttribute?.type} is allowed`);
    }
  }
}
