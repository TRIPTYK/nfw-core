/* eslint-disable max-classes-per-file */
/* eslint-disable max-statements */
import JSONAPISerializer from 'json-api-serializer';
import type { AbstractResource } from 'resources';
import { AbstractResourceSerializer } from 'resources';
import { SerializerGenerator } from './utils/serializer-generator.js';

export class JsonApiResourceSerializer<T extends AbstractResource> extends AbstractResourceSerializer<T> {
  private serializer = new JSONAPISerializer();

  public async serializeMany (resources: T[]): Promise<unknown> {
    this.generateSerializer();
    return this.serializer.serialize(this.ownRegistry.schema.type, resources.map((r) => r.toJSON()));
  }

  public async serialize (resource: T): Promise<unknown> {
    this.generateSerializer();
    return this.serializer.serialize(this.ownRegistry.schema.type, resource.toJSON());
  }

  private generateSerializer () {
    const generator = new SerializerGenerator(this.registry, this.serializer);
    generator.generate(this.ownRegistry.schema);
  }
}
