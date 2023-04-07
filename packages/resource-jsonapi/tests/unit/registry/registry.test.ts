/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourcesRegistryImpl } from '../../../src/registry/registry.js';

describe('ResourcesRegistryImpl', () => {
  let resourcesRegistry: ResourcesRegistryImpl;

  @singleton()
  class ExampleSerializer {}
  @singleton()
  class ExampleDeserializer {}
    @singleton()
  class ExampleFactory {}
@singleton()
    class ExampleAdapter {}
@singleton()
class ExampleValidator {}
@singleton()
class ExampleAuthorizer {}
@singleton()
class ExampleSchema {}

beforeEach(() => {
  resourcesRegistry = container.resolve(ResourcesRegistryImpl);
  resourcesRegistry.register('example', {
    serializer: ExampleSerializer as never,
    deserializer: ExampleDeserializer as never,
    factory: ExampleFactory as never,
    adapter: ExampleAdapter as never,
    validator: ExampleValidator as never,
    authorizer: ExampleAuthorizer as never,
    schema: ExampleSchema as never
  });
});

describe('getSchemaFor', () => {
  it('should resolve the schema for the given type', () => {
    const schema = resourcesRegistry.getSchemaFor('example');
    expect(schema).toBeInstanceOf(ExampleSchema);
  });
});

describe('getSerializerFor', () => {
  it('should resolve the serializer for the given type', () => {
    const serializer = resourcesRegistry.getSerializerFor('example');
    expect(serializer).toBeInstanceOf(ExampleSerializer);
  });
});

describe('getAdapterFor', () => {
  it('should resolve the adapter for the given type', () => {
    const adapter = resourcesRegistry.getAdapterFor('example');
    expect(adapter).toBeInstanceOf(ExampleAdapter);
  });
});

describe('getDeserializerFor', () => {
  it('should resolve the deserializer for the given type', () => {
    const deserializer = resourcesRegistry.getDeserializerFor('example');
    expect(deserializer).toBeInstanceOf(ExampleDeserializer);
  });
});

describe('getValidatorFor', () => {
  it('should resolve the validator for the given type', () => {
    const validator = resourcesRegistry.getValidatorFor('example');
    expect(validator).toBeInstanceOf(ExampleValidator);
  });
});

describe('getAuthorizerFor', () => {
  it('should resolve the authorizer for the given type', () => {
    const authorizer = resourcesRegistry.getAuthorizerFor('example');
    expect(authorizer).toBeInstanceOf(ExampleAuthorizer);
  });
});

describe('getFactoryFor', () => {
  it('should resolve the factory for the given type', () => {
    const factory = resourcesRegistry.getFactoryFor('example');
    expect(factory).toBeInstanceOf(ExampleFactory);
  });
});
});
