import { expect, it } from "vitest";
import { UnknownFieldInSchemaError } from "../../../src/index.js";
import { ThrowOnKeyNotInWhitelist } from "../../../src/utils/whitelist-apply.js";


const fakeObject = {
	authorizedKey: '',
	unauthorizedkey: ''
}

it("throw error if at least 1 key not in whitelist", () => {
	const whitelist = ['authorizedKey'];
	expect(() => ThrowOnKeyNotInWhitelist(fakeObject, whitelist, 'banane')).toThrowError(new UnknownFieldInSchemaError('unauthorizedkey are not allowed for banane', ['authorizedKey']));
})	

it("resolve successfully if all key in whitelist", () => {
	const whitelist = ['authorizedKey', 'unauthorizedkey'];
	expect(() => ThrowOnKeyNotInWhitelist(fakeObject, whitelist, 'banane')).not.toThrowError(new UnknownFieldInSchemaError('unauthorizedkey are not allowed for banane', ['authorizedKey']));
})	
