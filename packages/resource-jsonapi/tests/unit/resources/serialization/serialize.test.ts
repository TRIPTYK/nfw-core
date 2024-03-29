/* eslint-disable max-lines */
// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import type { ResourceSchema } from '../../../../src/index.js';
import { JsonApiResourceSerializer } from '../../../../src/serialization/serializer.js';
import { defaultAttribute, defaultRelation } from '../../test-utils/default-schema-parts.js';

const schema: ResourceSchema = {
  resourceType: 'test',
  attributes: {
    name: defaultAttribute(),
    age: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation('dummy', 'belongs-to'),
    relations: defaultRelation('dummy', 'has-many'),
  },
} as never;

const schemaForRelationship: ResourceSchema<never> = {
  resourceType: 'dummy',
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    test: defaultRelation('test', 'belongs-to'),
  },
} as never;

// eslint-disable-next-line max-statements
describe('JsonApiResourceSerializer', () => {
  const registryMock = {
    getSchemaFor: vi.fn((type: string) => {
      if (type === 'dummy') {
        return schemaForRelationship;
      } else {
        return schema;
      }
    }),
    getConfig: vi.fn(() => {
      return {
        host: 'http://localhost:8080',
      };
    }),
  };

  class TestResource {
    [key: string]: unknown;
    resourceType: string = 'test';
    id?: string;
    name!: string;
    age!: number;
    relation!: DummyResource | null;
  }

  class DummyResource {
    [key: string]: unknown;
    resourceType: string = 'dummy';
    id?: string;
    declare name: string;
  }

  class TestSerializer extends JsonApiResourceSerializer {
    type: string = 'test';
  }

  const serializer = new TestSerializer(registryMock as never);

  function makeTestResource () {
    const resource = new TestResource();
    resource.id = '1';
    resource.age = 1;
    resource.name = 'Test';
    return resource;
  }

  function makeDummyResource () {
    const resource = new DummyResource();
    resource.id = '1';
    resource.name = 'Test';
    return resource;
  }

  describe('serializeOne', () => {
    it('should serialize one resource', async () => {
      const resource = makeTestResource();
      const result = await serializer.serializeOne(resource, {}, {
        endpointURL: 'test/1',
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "data": {
            "attributes": {
              "age": 1,
              "name": "Test",
            },
            "id": "1",
            "links": {
              "self": "http://localhost:8080/test/1",
            },
            "meta": undefined,
            "relationships": undefined,
            "type": "test",
          },
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "self": "http://localhost:8080/test/1",
          },
          "meta": undefined,
        }
      `);
    });
  });

  describe('serializeMany', () => {
    it('should serialize many resources', async () => {
      const resource = makeTestResource();

      const result = await serializer.serializeMany([resource], {}, {
        pagination: {
          number: 1,
          size: 2,
          total: 10,
        },
        endpointURL: 'test',
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "age": 1,
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "test",
            },
          ],
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "first": "http://localhost:8080/test?page[number]=1&page[size]=2",
            "last": "http://localhost:8080/test?page[number]=5&page[size]=2",
            "next": "http://localhost:8080/test?page[number]=2&page[size]=2",
            "self": "http://localhost:8080/test",
          },
          "meta": {
            "pageTotal": 5,
            "size": 2,
            "total": 10,
          },
        }
      `);
    });

    it('should serialize null relationships', async () => {
      const resource = makeTestResource();
      // eslint-disable-next-line unicorn/no-null
      resource.relation = null;

      const result = await serializer.serializeMany([resource], {
        include: [
          {
            relationName: 'relation',
            nested: [],
          },
        ],
      }, {
        endpointURL: 'test',
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "age": 1,
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": {
                "relation": {
                  "data": null,
                  "links": undefined,
                  "meta": undefined,
                },
              },
              "type": "test",
            },
          ],
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "self": "http://localhost:8080/test",
          },
          "meta": undefined,
        }
      `);
    });

    it('should serialize many resources and relationships', async () => {
      const resource = makeTestResource();
      resource.relation = makeDummyResource();
      resource.relations = [makeDummyResource()];

      const result = await serializer.serializeMany([resource], {
        include: [{
          relationName: 'relation',
          nested: [],
        }, {
          relationName: 'relations',
          nested: [],
        }],
      }, {
        endpointURL: 'test',
        pagination: {
          number: 1,
          size: 2,
          total: 10,
        },
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "age": 1,
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": {
                "relation": {
                  "data": {
                    "id": "1",
                    "type": "dummy",
                  },
                  "links": undefined,
                  "meta": undefined,
                },
                "relations": {
                  "data": [
                    {
                      "id": "1",
                      "type": "dummy",
                    },
                  ],
                  "links": undefined,
                  "meta": undefined,
                },
              },
              "type": "test",
            },
          ],
          "included": [
            {
              "attributes": {
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/dummy/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "dummy",
            },
          ],
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "first": "http://localhost:8080/test?page[number]=1&page[size]=2",
            "last": "http://localhost:8080/test?page[number]=5&page[size]=2",
            "next": "http://localhost:8080/test?page[number]=2&page[size]=2",
            "self": "http://localhost:8080/test",
          },
          "meta": {
            "pageTotal": 5,
            "size": 2,
            "total": 10,
          },
        }
      `);
    });

    it('If a sparse-fields is asked, return only asked', async () => {
      const resource = makeTestResource();
      const result = await serializer.serializeMany([resource], {
        include: [],
        fields: {
          test: ['name'],
        },
      }, {
        endpointURL: 'test',
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "test",
            },
          ],
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "self": "http://localhost:8080/test",
          },
          "meta": undefined,
        }
      `);
    });

    it('Serializer should only serialize relationships that have been asked in includes', async () => {
      const resource = makeTestResource();
      resource.relation = makeDummyResource();

      const result = await serializer.serializeMany([resource], {
        include: [],
      }, {
        endpointURL: 'test',
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "age": 1,
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "test",
            },
          ],
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "self": "http://localhost:8080/test",
          },
          "meta": undefined,
        }
      `);
    });

    it('Serialize mixed resources', async () => {
      const result = await serializer.serializeMany([makeTestResource(), makeDummyResource()], {
        include: [],
      }, {
        endpointURL: 'dummy/1',
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "attributes": {
                "age": 1,
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/test/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "test",
            },
            {
              "attributes": {
                "name": "Test",
              },
              "id": "1",
              "links": {
                "self": "http://localhost:8080/dummy/1",
              },
              "meta": undefined,
              "relationships": undefined,
              "type": "dummy",
            },
          ],
          "included": undefined,
          "jsonapi": {
            "version": "1.0",
          },
          "links": {
            "self": "http://localhost:8080/dummy/1",
          },
          "meta": undefined,
        }
      `);
    });
  });
});
