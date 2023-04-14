/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
import JSONAPISerializer from 'json-api-serializer';
import { SerializerGenerator } from './utils/serializer-generator.js';
import { serializationSchema } from 'resources';
import type { Resource, ResourceSerializer, ResourcesRegistry } from 'resources';

export class JsonApiResourceSerializer<T extends Resource> implements ResourceSerializer<T> {
  private serializer = new JSONAPISerializer();

  public constructor (
    public type: string,
    public registry: ResourcesRegistry
  ) {

  }

  public async serializeMany (resources: T[]): Promise<unknown> {
    this.generateSerializer();
    return this.serializer.serialize(this.type, resources);
  }

  public async serializeOne (resource: T): Promise<unknown> {
    this.generateSerializer();
    return this.serializer.serialize(this.type, resource);
  }

  private generateSerializer () {
    const generator = new SerializerGenerator(this.registry, this.serializer);
    generator.generate(serializationSchema(this.registry.getSchemaFor(this.type)));
  }
}
