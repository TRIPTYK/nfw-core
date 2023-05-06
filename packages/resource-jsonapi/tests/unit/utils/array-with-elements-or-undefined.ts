import {  describe,  it, assert } from "vitest";
import { arrayWithElementsOrUndefined } from "../../../src/utils/array-with-elements-or-undefined.js";

describe('arrayWithElementsOrUndefined', () => {
    it('returns undefined if passed Map is empty', () => {
      const emptyMap = new Map();
      const result = arrayWithElementsOrUndefined(emptyMap);
      assert.strictEqual(result, undefined);
    });
  
    it('returns an array if passed Map is not empty', () => {
      const nonEmptyMap = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
      const result = arrayWithElementsOrUndefined(nonEmptyMap);
      assert.deepStrictEqual(result, ['one', 'two', 'three']);
    });
});