import { expect, it } from "vitest";
import {removeKeyFromObjectNotInWhitelist} from "../../../src/utils/whitelist-apply.js";


const fakeObject = {
	authorizedKey: '',
	unauthorizedkey: ''
}

it("Filter Key in the Object based on the whitelist", () => {
	const whitelist = ["authorizedKey"]
	removeKeyFromObjectNotInWhitelist(fakeObject, whitelist);
	expect(Object.keys(fakeObject)).contains('authorizedKey');
	expect(Object.keys(fakeObject)).not.includes('unauthorizedkey');
})	
