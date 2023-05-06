import { describe, expect, it } from "vitest";
import { serializableRelationships } from "../../../src/utils/serializable-relationships.js";

describe('serializableRelationships', () => {
  it('should return serialized relationships from the given schema', () => {
    const schema = {
      relationships: {
        author: {
          serialize: true,
        },
        publisher: {
          serialize: false,
        },
      }
    };
    const result = serializableRelationships(schema as never);
    expect(result).toEqual({ author: {
        serialize: true,
      }
    });
  });
  it('should return empty object if no relationships are serializeable', () => {
    const schema = {
      relationships: {
        publisher: {
          serialize: false,
        }, 
      }
    };

    const result = serializableRelationships(schema as never);
    expect(result).toEqual( {});
  });
});