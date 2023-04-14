import type { RelationshipOptions } from 'json-api-serializer';
import JSONAPISerializer from 'json-api-serializer';
import {filterForWhitelist} from '../dist/src/utils/whitelist-filter';
import { ResourceSchema, SchemaRelationship } from './interfaces/schema';
import { ResourcesRegistry } from './registry/registry';

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
    const serializer = this.registry.getDeserializerFor<JSONAPISerializer>(this.type);
    return serializer.deserialize(this.type, payload);
  }

}
