import 'reflect-metadata';
import {container, singleton} from '@triptyk/nfw-core';
import { assert, beforeEach, test } from "vitest";
import { JsonApiResourceDeserializer, ResourceSchema, ResourcesRegistryImpl, SerializerGenerator } from '../../../src/index.js';
import { defaultAttribute, defaultRelation } from '../test-utils/default-schema-parts.js';

@singleton()
class ExampleSerializer {}

const schema: ResourceSchema<Record<string, unknown>> = {
  type: 'article',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('user', 'belongs-to')
  }
};
const resourcesRegistry = container.resolve(ResourcesRegistryImpl);
const deserializer = new SerializerGenerator('article',  resourcesRegistry);

resourcesRegistry.register('article', {
  serializer: ExampleSerializer as never,
  deserializer,
  schema
});


beforeEach(() => {
});

test('It deserializes a payload and ignores unknown', async () => {
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
