/* eslint-disable max-classes-per-file */
import { expect, describe, test } from 'vitest';
import type { SchemaRegistries } from '../../../src/index.js';
import { addResourceTypes } from '../../../src/utils/add-types-from-schema.js';

class FooModel {
  [key: string]: unknown;
  id: string = '1';
  foo = 'james';
}

class DummyModel {
    [key: string]: unknown;
    id: string = '1';
    foo = new FooModel();
}

const fooSchema = {
  resourceType: 'foo',
  relationships: {
    dummy: {
      type: 'dummy',
    },
  },
};

const dummySchema = {
  resourceType: 'dummy',
  relationships: {
    foo: {
      type: 'foo',
    },
  },
};

const registry: SchemaRegistries = {
  getSchemaFor: (type) => {
    if (type === 'foo') {
      return fooSchema as never;
    }
    if (type === 'dummy') {
      return dummySchema as never;
    }
    throw new Error('Unknown type');
  },
};

describe('addResourceTypes', () => {
  test('should correctly assign types', () => {
    const resource = new DummyModel();

    const descriminatorMap = new Map<any, string>([[DummyModel, 'dummy'], [FooModel, 'foo']]);

    addResourceTypes([resource], descriminatorMap, registry);
    expect(resource).toMatchInlineSnapshot(`
      DummyModel {
        "foo": FooModel {
          "foo": "james",
          "id": "1",
          "type": "foo",
        },
        "id": "1",
        "type": "dummy",
      }
    `);
  });
  test('should throw error on unregistered type', () => {
    const resource = new DummyModel();
    const descriminatorMap = new Map<any, string>([[FooModel, 'foo']]);
    expect(() => addResourceTypes([resource], descriminatorMap, registry)).toThrowError('No type found for DummyModel');
  });
});
