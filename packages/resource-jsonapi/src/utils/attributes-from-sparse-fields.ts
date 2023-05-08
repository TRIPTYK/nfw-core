import type { ResourceSchema } from '../interfaces/schema.js';

export function attributesFromSparseFields (schema: ResourceSchema, fields: Record<string, string[]>) {
  return fields[schema.type]
    ? Object.fromEntries(Object.entries(schema.attributes).filter(([name]) => fields[schema.type].includes(name)))
    : schema.attributes;
}
