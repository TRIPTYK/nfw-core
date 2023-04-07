/* eslint-disable class-methods-use-this */
import type { Resource, ResourceAdapter, ResourceAuthorizer, ResourceDeserializer, ResourceFactory, ResourceSchema, ResourceSerializer, ResourceValidator, ResourcesRegistry } from 'resources';
import { container, singleton } from '@triptyk/nfw-core';
import type { Class } from 'type-fest';

@singleton()
export class ResourcesRegistryImpl implements ResourcesRegistry {
  getSchemaFor<T extends Resource> (type: string): ResourceSchema<T> {
    return container.resolve(`schema:${type}`);
  }

  getSerializerFor<T extends Resource> (type: string): ResourceSerializer<T> {
    return container.resolve(`serializer:${type}`);
  }

  getDeserializerFor<T extends Resource> (type: string): ResourceDeserializer<T> {
    return container.resolve(`deserializer:${type}`);
  }

  getFactoryFor<T extends Resource> (type: string): ResourceFactory<T> {
    return container.resolve(`factory:${type}`);
  }

  // eslint-disable-next-line max-statements
  register<T extends Resource> (type: string, classes: {
    serializer: Class<ResourceSerializer<T>>,
    deserializer: Class<ResourceDeserializer<T>>,
    factory: Class<ResourceFactory<T>>,
    adapter: Class<ResourceAdapter>,
    validator: Class<ResourceValidator<T>>,
    authorizer: Class<ResourceAuthorizer<unknown, T, string>>,
    schema: Class<ResourceSchema<T>>,
  }): void {
    container.register(`serializer:${type}`, { useClass: classes.serializer });
    container.register(`deserializer:${type}`, { useClass: classes.deserializer });
    container.register(`factory:${type}`, classes.factory);
    container.register(`adapter:${type}`, classes.adapter);
    container.register(`validator:${type}`, classes.validator);
    container.register(`authorizer:${type}`, classes.authorizer);
    container.register(`schema:${type}`, classes.schema);
  }
}
