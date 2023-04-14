import 'reflect-metadata';
import { assert, test } from "vitest";
import { JsonApiResourceDeserializer, ResourceSchema } from '../../../src/index.js';
import { defaultAttribute, defaultRelation } from '../test-utils/default-schema-parts.js';

const schema: ResourceSchema<Record<string, unknown>> = {
  type: 'article',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('user', 'belongs-to')
  }
};

test('It deserializes a payload and ignores unknown', async () => {
  const deserializer = new JsonApiResourceDeserializer('article', {
    getSchemaFor () {
      return schema;
    }
  } as never);

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
