import { Resource } from "../interfaces/resource.js";
import { SchemaAttributes } from "../interfaces/schema.js";

export function extractSerializableAttributes<T extends Resource>(
  resource: T,
  attributes: SchemaAttributes<T>,
): Record<string, unknown> {
  const serializableAttributes: Record<string, unknown> = {};

  Object.entries(attributes).forEach(([attributeName, attributeMetadata]) => {
    if (attributeMetadata?.serialize && resource[attributeName] !== undefined) {
      serializableAttributes[attributeName] = resource[attributeName];
    }
  });

  return serializableAttributes;
}