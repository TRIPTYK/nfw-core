/* eslint-disable class-methods-use-this */
import { container, singleton } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';
import { ResourceDeserializer } from '../interfaces/deserializer.js';
import { ResourceSchema } from '../interfaces/schema.js';
import { ResourceSerializer } from '../interfaces/serializer.js';

export interface ResourcesRegistry {
    getSchemaFor<T extends Record<string, unknown>>(type: string): ResourceSchema<T>;
    getSerializerFor<T extends Record<string, unknown>>(type: string): ResourceSerializer<T>;
    getDeserializerFor<T extends Record<string, unknown>>(type: string): ResourceDeserializer<T>;
}

@singleton()
export class ResourcesRegistryImpl implements ResourcesRegistry {
  getSchemaFor<T extends Record<string, unknown>> (type: string): ResourceSchema<T> {
    return container.resolve(`schema:${type}`) as ResourceSchema<T>;
  }

  getSerializerFor<T  extends Record<string, unknown>> (type: string): ResourceSerializer<T> {
    return container.resolve(`serializer:${type}`);
  }

  getDeserializerFor<T extends Record<string, unknown>> (type: string): ResourceDeserializer<T> {
    return container.resolve(`deserializer:${type}`);
  }

  register<T extends  Record<string, unknown>> (type: string, classes: {
    serializer: Class<ResourceSerializer<T>>,
    deserializer: Class<ResourceDeserializer<T>>,
    schema: ResourceSchema<T>,
  }): void {
    container.register(`serializer:${type}`, { useClass: classes.serializer });
    container.register(`deserializer:${type}`, { useClass: classes.deserializer });
    container.register(`schema:${type}`, {
      useValue: classes.schema
    });
  }
}
