import { singleton } from '@triptyk/nfw-core';
import JSONAPISerializer from 'json-api-serializer';
import type { ResourceDeserializer } from '../interfaces/deserializer.js';
import type { ResourcesRegistry } from '../registry/registry.js';
import { DeserializerGenerator } from './generator/deserializer.js';
import { ThrowOnKeyNotInWhitelist } from '../utils/whitelist-apply.js';
import { filterForWhitelist } from '../utils/whitelist-filter.js';
import type { Resource } from '../interfaces/resource.js';

@singleton()
export class JsonApiResourceDeserializer<T extends Resource> implements ResourceDeserializer<T> {
  private deserializer = new JSONAPISerializer();

  public constructor (
    public type: string,
    public registry: ResourcesRegistry,
  ) {
    this.generateDeserializer();
  }

  public async deserialize (payload: Record<string, unknown>): Promise<T> {
    const deserialized = this.deserializer.deserialize(this.type, payload);
    this.removeUnknownFieldFromPayload(deserialized);

    return deserialized;
  }

  private generateDeserializer () {
    const generator = new DeserializerGenerator(this.registry, this.deserializer);
    generator.generate(this.registry.getSchemaFor(this.type));
  }

  private removeUnknownFieldFromPayload (deserialized: Partial<T>): Partial<T> {
    const whitelist = this.buildWhitelistForDeserialize();
    ThrowOnKeyNotInWhitelist(deserialized, whitelist, this.type);
    return deserialized;
  }

  private buildWhitelistForDeserialize () {
    const schema = this.registry.getSchemaFor(this.type);
    const whitelistAttributes = filterForWhitelist(schema.attributes, 'deserialize');
    const whitelistRelations = filterForWhitelist(schema.relationships, 'deserialize');

    return ['id', ...whitelistRelations, ...whitelistAttributes];
  }
}
