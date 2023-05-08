import type { SchemaAttributes, SchemaRelationships } from '../interfaces/schema.js';

type FilterableFor = 'deserialize' | 'serialize';

// eslint-disable-next-line @foxglove/no-boolean-parameters
function addToWhiteListIfAllowed (whitelist: string[], isAllowed: boolean | undefined, key: string) {
  if (isAllowed) {
    whitelist.push(key);
  }
}

export function filterForWhitelist<T extends Record<string, unknown>> (unfilteredList: SchemaAttributes<T> | SchemaRelationships<T>, filterFor: FilterableFor) {
  const whitelist: string[] = [];

  for (const key in unfilteredList) {
    addToWhiteListIfAllowed(whitelist, unfilteredList[key]?.[filterFor], key);
  }

  return whitelist;
}
