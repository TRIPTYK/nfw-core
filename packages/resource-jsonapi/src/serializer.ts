/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
import JSONAPISerializer from 'json-api-serializer';
import {ResourcesRegistry} from './registry/registry.js';
import {ResourceSerializer} from './interfaces/serializer.js';
import {SerializerGenerator} from './utils/serializer-generator.js';

export class JsonApiResourceSerializer<T extends Record<string, unknown>> implements ResourceSerializer<T> {
  private serializer = new JSONAPISerializer();

  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {
    this.generateSerializer();
  }

  public async serializeMany (resources: T[]): Promise<unknown> {
    return this.serializer.serialize(this.type, resources);
  }

  public async serializeOne (resource: T): Promise<unknown> {
    return this.serializer.serialize(this.type, resource);
  }

  private generateSerializer () {
    const generator = new SerializerGenerator(this.registry, this.serializer);
    generator.generate(this.registry.getSchemaFor(this.type));
  }
}
