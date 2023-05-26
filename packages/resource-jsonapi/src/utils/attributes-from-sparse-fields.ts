import type { ResourceSchema } from '../interfaces/schema.js';

export function attributesFromSparseFields (schema: ResourceSchema, fields: Record<string, string[]>) {
  return fields[schema.resourceType]
    ? Object.fromEntries(Object.entries(schema.attributes).filter(([name]) => fields[schema.resourceType].includes(name)))
    : schema.attributes;
}
