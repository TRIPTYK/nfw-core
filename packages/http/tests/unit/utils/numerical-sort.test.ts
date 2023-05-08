import { numericalSortOnKeyASC } from '../../../src/utils/numerical-sort.js';
import { describe, expect, beforeEach, it } from 'vitest';

describe('Numerical sort test', () => {
  let array: any[];

  beforeEach(() => {
    const first = {
      index: 5,
    };
    const second = {
      index: 1,
    };
    array = [first, second];
  });

  it('sorts array of objects based on numerical key', () => {
    expect(numericalSortOnKeyASC(array, 'index')).toStrictEqual([array[1], array[0]]);
  });
  it('sorted array is not the same reference to the original', () => {
    const sorted = numericalSortOnKeyASC(array, 'index');
    expect(sorted !== array).toStrictEqual(true);
  });
});
