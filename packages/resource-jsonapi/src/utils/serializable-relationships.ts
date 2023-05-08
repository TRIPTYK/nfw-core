import type { Resource } from '../interfaces/resource.js';
import type { ResourceSchema, SchemaRelationships } from '../interfaces/schema.js';

export function serializableRelationships (schema: ResourceSchema<Resource>): SchemaRelationships {
  return Object.entries(schema.relationships).reduce((p, [key, value]) => {
    if (value?.serialize) {
      p[key] = value;
    }
    return p;
  }, {} as SchemaRelationships);
}
