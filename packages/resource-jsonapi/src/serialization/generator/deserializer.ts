import type JSONAPISerializer from 'json-api-serializer';
import type { ResourceSchema } from '../../interfaces/schema.js';
import type { ResourcesRegistry } from '../../registry/registry.js';
import { BaseSerializerGenerator } from './base.js';

export class DeserializerGenerator extends BaseSerializerGenerator {
  public constructor (
    protected registry: ResourcesRegistry,
    protected serializer: JSONAPISerializer,
  ) {
    super(registry, serializer);
  }

  // eslint-disable-next-line class-methods-use-this
  public baseSchemaAndWhitelist<T extends ResourceSchema<Record<string, unknown>>> (_schema: T): JSONAPISerializer.Options {
    return {
      relationships: {},
    };
  }
}
