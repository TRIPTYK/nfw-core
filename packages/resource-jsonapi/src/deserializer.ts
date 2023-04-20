import JSONAPISerializer from 'json-api-serializer';
import { ResourceSchema } from './interfaces/schema.js';
import { ResourcesRegistry } from './registry/registry.js';
import { DeserializerGenerator } from './serializer-generators/deserializer-generator.js';

export class JsonApiResourceDeserializer<T extends Record<string, unknown>> {
  private deserializer = new JSONAPISerializer();
 
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {
    this.generateDeserializer();
  }

  get schema () {
    return this.registry.getSchemaFor(this.type) as ResourceSchema<Record<string, unknown>>;
  }

  public async deserialize (payload: T): Promise<Partial<T>> {
    const serializer = this.registry.getDeserializerFor<T>(this.type);
    return serializer.deserialize(payload);
  }

  private generateDeserializer() {
    const generator = new DeserializerGenerator(this.registry, this.deserializer);
    generator.generate(this.registry.getSchemaFor(this.type));
  }
}
