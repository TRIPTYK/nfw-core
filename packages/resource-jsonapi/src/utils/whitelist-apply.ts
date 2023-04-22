export function removeKeyNotInWhitelist(object: Record<string, unknown>, whitelist: string[]) {
	for (const key in object) {
		removeIfKeyNotIncludedInWhitelist(object, whitelist, key);
	}
}

function removeIfKeyNotIncludedInWhitelist(object: Record<string, unknown>, whitelist: string [], key: string) {
	if (whitelist.includes(key))  {
		return;
	}
	delete object[key];
}
