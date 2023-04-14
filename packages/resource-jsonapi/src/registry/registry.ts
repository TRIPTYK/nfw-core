/* eslint-disable class-methods-use-this */
import { container, singleton } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';


export interface ResourcesRegistry {
    getSchemaFor<T>(type: string): T;
    getSerializerFor<T>(type: string): T;
    getDeserializerFor<T>(type: string): T;
    getFactoryFor<T>(type: string): T;
}

@singleton()
export class ResourcesRegistryImpl implements ResourcesRegistry {
  getSchemaFor<T> (type: string): T {
    return container.resolve(`schema:${type}`);
  }

  getSerializerFor<T> (type: string): T {
    return container.resolve(`serializer:${type}`);
  }

  getDeserializerFor<T> (type: string): T {
    return container.resolve(`deserializer:${type}`);
  }

  getFactoryFor<T> (type: string): T {
    return container.resolve(`factory:${type}`);
  }

  register<T> (type: string, classes: {
    serializer: Class<T>,
    deserializer: Class<T>,
    factory: Class<T>,
    schema: Class<T>,
  }): void {
    container.register(`serializer:${type}`, { useClass: classes.serializer });
    container.register(`deserializer:${type}`, { useClass: classes.deserializer });
    container.register(`factory:${type}`, classes.factory);
    container.register(`schema:${type}`, classes.schema);
  }
}
