export function removeKeyNotInWhitelist(object: Record<string, unknown>, whitelist: string[]) {
	for (const key in object) {
		removeKeysNotInWhitelist(object, whitelist, key);
	}
}

function removeKeysNotInWhitelist(object: Record<string, unknown>, whitelist: string [], key: string) {
	if (whitelist.includes(key))  {
		return;
	}
	delete object[key];
}
