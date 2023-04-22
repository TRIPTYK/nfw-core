import 'reflect-metadata';
import { container, inject, singleton } from '@triptyk/nfw-core';
import { assert, beforeEach, test } from "vitest";
import { ResourceSchema, ResourcesRegistry, ResourcesRegistryImpl } from '../../../src/index.js';
import { defaultAttribute, defaultRelation } from '../test-utils/default-schema-parts.js';
import { JsonApiResourceDeserializer } from '../../../src/deserializer.js';


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

test('It deserializes a payload and ignores unknown', async () => {
  const deserializer = resourcesRegistry.getDeserializerFor('article');
  const deserialized = await deserializer.deserialize({
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
        relation2: {
          data: {
            type: 'user',
            id: '1'
          }
        }
      }
    }
  });

  assert.deepEqual<any>(deserialized, {
    name: 'hello',
    relation: '1'
  });
});
