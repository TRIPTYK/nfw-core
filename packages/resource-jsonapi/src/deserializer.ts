import JSONAPISerializer from 'json-api-serializer';
import { ResourceSchema } from './interfaces/schema';
import { ResourcesRegistry } from './registry/registry';

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

  public async deserialize (payload: Record<string, unknown>): Promise<Partial<T>> {
    const serializer = this.registry.getDeserializerFor(this.type);
    return serializer.deserialize(this.type, payload);
  }

  private generateDeserializer() {

  }
}
