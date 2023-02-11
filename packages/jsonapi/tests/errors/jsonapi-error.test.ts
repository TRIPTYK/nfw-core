import 'reflect-metadata';
import { JsonapiError } from '../../src/index.js';
import { expect, it } from 'vitest';

it('is instance of Error', () => {
  const err = new JsonapiError();
  expect(err).toBeInstanceOf(Error);
});
