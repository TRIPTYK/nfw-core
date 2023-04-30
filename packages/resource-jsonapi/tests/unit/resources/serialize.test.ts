// eslint-disable-next-line max-classes-per-file
import "reflect-metadata";
import { describe, it, expect, vi } from "vitest";
import type { ResourceSchema } from "../../../src/index.js";
import { JsonApiResourceSerializer } from "../../../src/serializer.js";
import {defaultAttribute, defaultRelation} from "../test-utils/default-schema-parts.js";

const schema: ResourceSchema<{}> = {
  type: "test",
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    relation: defaultRelation("dummy", "belongs-to"),
  }
} as never;

const schemaForRelationship: ResourceSchema<never> = {
  type: "dummy",
  attributes: {
    name: defaultAttribute(),
  },
  relationships: {
    test: defaultRelation("test", "belongs-to"),
  },
} as never;

// eslint-disable-next-line max-statements
describe("JsonApiResourceSerializer", () => {
  const registryMock = {
    getSchemaFor: vi.fn((type: string) => {
      if (type === "dummy") {
        return schemaForRelationship;
      } else {
        return schema;
      }
    }),
    getConfig: vi.fn(() => { 
      return { 
        host: 'http://localhost:8080'
      }
    }),
  };

  class TestResource {
		[key: string]: unknown;
    type: string = "test";
    id?: string;
    name!: string;
    relation!: DummyResource;
  }

  class DummyResource {
    type: string = "dummy";
    id?: string;
    declare name: string;
  }

  class TestSerializer extends JsonApiResourceSerializer<TestResource> {
    type: string = "test";
  }

  const serializer = new TestSerializer("test", registryMock as never);

  function makeTestResource() {
    const resource = new TestResource();
    resource.id = "1";
    resource.name = "Test";
    return resource;
  }

  function makeDummyResource() {
    const resource = new DummyResource();
    resource.id = "1";
    resource.name = "Test";
    return resource;
  }

  describe("serializeOne", () => {
    it("should serialize one resource", async () => {
      const resource = makeTestResource();

      const expectedResult = {
        jsonapi: {
          version: "1.0",
        },
        included: undefined,
        links: {
          self: "http://localhost:8080/test/1"
        },
        meta: undefined,
        data: {
          links: {  
            self: "http://localhost:8080/test/1"
          },
          meta: undefined,
          relationships: undefined,
          type: "test",
          id: "1",
          attributes: {
            name: "Test",
          },
        },
      };
      const result = await serializer.serializeOne(resource);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("serializeMany", () => {
    it("should serialize many resources", async () => {
      const resource = makeTestResource();
      const expectedResult = {
        jsonapi: {
          version: "1.0",
        },
        included: undefined,
        links: {
          "first": "http://localhost:8080/test?page[number]=1&page[size]=2",
          "last": "http://localhost:8080/test?page[number]=10&page[size]=2",
          "next": "http://localhost:8080/test?page[number]=2&page[size]=2",
          "self": "http://localhost:8080/test",
        },
        meta: undefined,
        data: [
          {
            links: {  
              self: "http://localhost:8080/test/1"
            },
            meta: undefined,
            relationships: undefined,
            type: "test",
            id: "1",
            attributes: {
              name: "Test",
            },
          },
        ],
      };
      const result = await serializer.serializeMany([resource], {
        number: 1,
        size: 2,
        total: 10
      });
      expect(result).toEqual(expectedResult);
    });

    it("should serialize many resources and relationships", async () => {
      const resource = makeTestResource();
      resource.relation = makeDummyResource();

      const expectedResult = {
        jsonapi: {
          version: "1.0",
        },
        links: {
          "first": "http://localhost:8080/test?page[number]=1&page[size]=2",
          "last": "http://localhost:8080/test?page[number]=10&page[size]=2",
          "next": "http://localhost:8080/test?page[number]=2&page[size]=2",
          "self": "http://localhost:8080/test",
        },
        meta: undefined,
        data: [
          {
            links: {  
              self: "http://localhost:8080/test/1"
            },
            meta: undefined,
            relationships: {
              relation: {
                data: {
                  type: "dummy",
                  id: "1",
                },
              },
            },
            type: "test",
            id: "1",
            attributes: {
              name: "Test",
            },
          },
        ],
        included: [
          {
            attributes: {
              name: "Test",
            },
            id: "1",
            links: {  
              self: "http://localhost:8080/dummy/1"
            },
            meta: undefined,
            relationships: undefined,
            type: "dummy",
          },
        ],
      };

      const result = await serializer.serializeMany([resource], {
        number: 1,
        size: 2,
        total: 10
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
