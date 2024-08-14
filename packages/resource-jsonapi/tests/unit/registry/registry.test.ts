/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { container, singleton } from '@triptyk/nfw-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourcesRegistryImpl } from '../../../src/registry/registry.js';
import { JsonApiResourceDeserializer, JsonApiResourceSerializer } from '../../../src/index.js';

describe('ResourcesRegistryImpl', () => {
  let resourcesRegistry: ResourcesRegistryImpl;

  @singleton()
  class ExampleSerializer extends JsonApiResourceSerializer {
    public constructor () {
      super(container.resolve(ResourcesRegistryImpl));
    }
  }

  @singleton()
  class ExampleDeserializer extends JsonApiResourceDeserializer<never> {
    public constructor () {
      super('example', container.resolve(ResourcesRegistryImpl));
    }
  }

  beforeEach(() => {
    resourcesRegistry = container.resolve(ResourcesRegistryImpl);
    resourcesRegistry.register('example', {
      serializer: ExampleSerializer,
      deserializer: ExampleDeserializer,
      schema: {
        resourceType: 'example',
        relationships: {},
        attributes: {},
      },
    });
  });

  describe('register', () => {
    it('should register a resource with its serializer, deserializer and schema', () => {
      resourcesRegistry.register('example', {
        serializer: ExampleSerializer,
        deserializer: ExampleDeserializer,
        schema: {
          resourceType: 'example',
          relationships: {},
          attributes: {},
        },
      });

      const schema = resourcesRegistry.getSchemaFor('example');

      expect(schema).toMatchInlineSnapshot(`
        {
          "attributes": {},
          "relationships": {},
          "resourceType": "example",
        }
      `);
    });
    it('should register default serializer and deserializer if not provided', () => {
      resourcesRegistry.register('example', {
        schema: {
          resourceType: 'example',
          relationships: {},
          attributes: {},
        },
      });

      const serializer = resourcesRegistry.getSerializerFor('example');
      const deserializer = resourcesRegistry.getDeserializerFor('example');

      expect(serializer).toBeDefined();
      expect(deserializer).toBeDefined();
    });
  });

  describe('getSchemaFor', () => {
    it('should resolve the schema for the given type', () => {
      const schema = resourcesRegistry.getSchemaFor('example');
      expect(schema).toMatchInlineSnapshot(`
        {
          "attributes": {},
          "relationships": {},
          "resourceType": "example",
        }
      `);
    });
  });

  describe('getSerializerFor', () => {
    it('should resolve the serializer for the given type', () => {
      const serializer = resourcesRegistry.getSerializerFor('example');
      expect(serializer).toBeInstanceOf(ExampleSerializer);
    });
  });

  describe('getDeserializerFor', () => {
    it('should resolve the deserializer for the given type', () => {
      const deserializer = resourcesRegistry.getDeserializerFor('example');
      expect(deserializer).toBeInstanceOf(ExampleDeserializer);
    });
  });
});
