import { ResourceSchema } from './interfaces/schema';
import { ResourcesRegistry } from './registry/registry';

export class JsonApiResourceDeserializer<T extends Record<string, unknown>> {
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {

  }

  get schema () {
    return this.registry.getSchemaFor(this.type) as ResourceSchema<Record<string, unknown>>;
  }

  public async deserialize (payload: Record<string, unknown>): Promise<Partial<T>> {
    const serializer = this.registry.getDeserializerFor<T>(this.type);
    return serializer.deserialize(this.type, payload);
  }

}
