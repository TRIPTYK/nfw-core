import 'reflect-metadata';
import { assert, test } from "vitest";
import { JsonApiResourceDeserializer } from '../../../src/deserializer.js';
import { ResourceSchema } from 'resources';
import { defaultAttribute, defaultRelation } from "./utils.js";

const schema: ResourceSchema<never> = {
  type: 'article',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('user','belongs-to')
  }
} as never;

test("It deserializes a payload and ignores unknown",async () => {
  const deserializer = new JsonApiResourceDeserializer('article', {
    getSchemaFor() {
      return schema;
    },
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
  })

  assert.deepEqual<any>(deserialized, {
    name: 'hello',
    relation: '1'
  });
})