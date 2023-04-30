import { UnknownFieldInSchemaError } from "../errors/unknown-field.js";

export function ThrowOnKeyNotInWhitelist(object: Record<string, unknown>, whitelist: string[], type: string) {
  const unallowed = Object.keys(object).filter((key) => !whitelist.includes(key));
	throwErrorOnUnallowedNotEmpty(unallowed, type);
}

function throwErrorOnUnallowedNotEmpty(unallowed: string [], type: string) {
  if (unallowed.length) {
    throw new UnknownFieldInSchemaError(`${unallowed.join(',')} are not allowed for ${type}`, unallowed);
  }
}
