import 'reflect-metadata';
import { container, inject, singleton } from '@triptyk/nfw-core';
import { assert, beforeEach, expect, test } from "vitest";
import { ResourceSchema, ResourcesRegistry, ResourcesRegistryImpl, UnknownFieldInSchemaError } from '../../../src/index.js';
import { defaultAttribute, defaultRelation } from '../test-utils/default-schema-parts.js';
import { JsonApiResourceDeserializer } from '../../../src/serialization/deserializer.js';


let resourcesRegistry: ResourcesRegistryImpl;

@singleton()
class ExampleSerializer {}

const schemaArticle: ResourceSchema<Record<string, unknown>> = {
  type: 'article',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('user', 'belongs-to')
  }
};

const schemaUser: ResourceSchema<Record<string, unknown>> = {
  type: 'user',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('article', 'belongs-to')
  }
};


@singleton()
class ArticleDeserializer extends JsonApiResourceDeserializer<never> {
  constructor(@inject(ResourcesRegistryImpl) registry: ResourcesRegistry) {
    super('article', registry)
  }
}

@singleton()
class UserDeserializer extends JsonApiResourceDeserializer<never> {
  constructor(@inject(ResourcesRegistryImpl) registry: ResourcesRegistry) {
    super('article', registry)
  }
}

resourcesRegistry = container.resolve(ResourcesRegistryImpl);

resourcesRegistry.register('article', {
  schema: schemaArticle,
  deserializer:  ArticleDeserializer,
  serializer: ExampleSerializer as never
})

resourcesRegistry.register('user', {
  schema: schemaUser,
  deserializer:  UserDeserializer,
  serializer: ExampleSerializer as never
})

resourcesRegistry.setConfig({
  host: 'http://localhost:8080'
})

test('It throw error on unknown field', async () => {
  const deserializer = resourcesRegistry.getDeserializerFor('article');
  expect(deserializer.deserialize({
    data: {
      attributes: {
        name: 'hello',
        unknown_field: 'treuc'
      },
      relationships: {
        relation: {
          data: {
            type: 'user',
            id: '1'
          }
        },
      }
    }
  })).rejects.toThrowError(new UnknownFieldInSchemaError('unknown_field are not allowed for article', ["unknown_field"]));
});

test('It throw error on unknown relation', async () => {
  const deserializer = resourcesRegistry.getDeserializerFor('article');
  expect(deserializer.deserialize({
    data: {
      attributes: {
        name: 'hello',
      },
      relationships: {
        relation: {
          data: {
            type: 'user',
            id: '1'
          }
        },
        relation2: {
          data: {
            type: 'user',
            id: '1'
          }
        }
      }
    }
  })).rejects.toThrowError(new UnknownFieldInSchemaError('relation2 are not allowed for article', ["relation2"]));
});

test('It deserialize payload', async () => {
  const deserializer = resourcesRegistry.getDeserializerFor('article');
  const deserialized = await deserializer.deserialize({
    data: {
      attributes: {
        name: 'hello',
      },
      relationships: {
        relation: {
          data: {
            type: 'user',
            id: '1'
          }
        },
      }
    }
  });
  
  expect(deserialized).toStrictEqual({
    name: 'hello',
    relation: '1'
  })
});
