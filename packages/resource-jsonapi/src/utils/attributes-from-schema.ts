import type { Resource } from '../interfaces/resource.js';
import type { SchemaAttribute, SchemaAttributes } from '../interfaces/schema.js';

export function extractSerializableAttributes<T extends Resource> (
  resource: T,
  attributes: SchemaAttributes<T>,
): Record<string, unknown> {
  const serializableAttributes: Record<string, unknown> = {};

  Object.entries<SchemaAttribute | undefined>(attributes).forEach(([attributeName, attributeMetadata]) => {
    if (attributeMetadata?.serialize && resource[attributeName] !== undefined) {
      serializableAttributes[attributeName] = resource[attributeName];
    }
  });

  return serializableAttributes;
}
