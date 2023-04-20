import {SchemaAttributes, SchemaRelationships} from "../interfaces/schema.js";

type FilterableFor = 'deserialize' | 'serialize';

function addToWhiteListIfAllowed(whitelist: string[], isAllowed: boolean | undefined, key: string) {
	if (isAllowed) {
		whitelist.push(key);
	}
}

export function filterForWhitelist<T extends Record<string, unknown>>(unfilteredList: SchemaAttributes<T> | SchemaRelationships<T>, filterFor: FilterableFor) {
	const whitelist: string[] = [];

	for (const key in unfilteredList) {
		addToWhiteListIfAllowed(whitelist, unfilteredList[key]?.[filterFor], key)
	}

	return whitelist;
}
