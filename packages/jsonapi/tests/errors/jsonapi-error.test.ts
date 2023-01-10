import 'reflect-metadata';
import { JsonapiError } from '../../src/index.js';

it('is instance of Error', () => {
  const err = new JsonapiError();
  expect(err).toBeInstanceOf(Error);
});
