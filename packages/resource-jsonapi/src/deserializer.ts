import { singleton } from '@triptyk/nfw-core';
import JSONAPISerializer from 'json-api-serializer';
import {ResourceDeserializer} from './interfaces/deserializer.js';
import { ResourcesRegistry } from './registry/registry.js';
import { DeserializerGenerator } from './serializer-generators/deserializer-generator.js';
import { ThrowOnKeyNotInWhitelist } from './utils/whitelist-apply.js';
import { filterForWhitelist } from './utils/whitelist-filter.js';

@singleton()
export class JsonApiResourceDeserializer<T extends Record<string, unknown>> implements ResourceDeserializer<T> {
  private deserializer = new JSONAPISerializer();
 
  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {
    this.generateDeserializer();
  }

  private generateDeserializer() {
    const generator = new DeserializerGenerator(this.registry, this.deserializer);
    generator.generate(this.registry.getSchemaFor(this.type));
  }

  public async deserialize(payload: T): Promise<T> {
    const deserialized = this.deserializer.deserialize(this.type, payload);
    this.removeUnknownFieldFromPayload(deserialized);
    
    return deserialized;
  }

  private removeUnknownFieldFromPayload(deserialized: Partial<T>): Partial<T> {
    const whitelist = this.buildWhitelistForDeserialize();
    ThrowOnKeyNotInWhitelist(deserialized, whitelist, this.type)
    return deserialized;
  }

  private buildWhitelistForDeserialize() {
    const schema = this.registry.getSchemaFor(this.type);
    const whitelistAttributes = filterForWhitelist(schema.attributes, "deserialize");
    const whitelistRelations = filterForWhitelist(schema.relationships, "deserialize");
    
    return ['id', ...whitelistRelations, ...whitelistAttributes];
  }
}
