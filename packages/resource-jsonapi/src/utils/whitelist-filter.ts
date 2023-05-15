import type { Resource } from '../interfaces/resource.js';
import type { SchemaAttribute, SchemaAttributes, SchemaRelationship, SchemaRelationships } from '../interfaces/schema.js';

type FilterableFor = 'deserialize' | 'serialize';

// eslint-disable-next-line @foxglove/no-boolean-parameters
function addToWhiteListIfAllowed (whitelist: string[], isAllowed: boolean | undefined, key: string) {
  if (isAllowed) {
    whitelist.push(key);
  }
}

export function filterForWhitelist<T extends Resource> (unfilteredList: SchemaAttributes<T> | SchemaRelationships<T>, filterFor: FilterableFor) {
  const whitelist: string[] = [];

  for (const [key, value] of Object.entries<SchemaAttribute | SchemaRelationship | undefined>(unfilteredList)) {
    addToWhiteListIfAllowed(whitelist, value?.[filterFor], key);
  }

  return whitelist;
}
