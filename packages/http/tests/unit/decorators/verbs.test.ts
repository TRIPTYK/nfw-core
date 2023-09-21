import 'reflect-metadata';
import { container } from '@triptyk/nfw-core';
import { ALL, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } from '../../../src/decorators/verbs.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';
import { describe, expect, beforeEach, test } from 'vitest';

describe('Decorators | verbs', () => {
  let metadataStorage: MetadataStorage;

  class Target {
    // eslint-disable-next-line class-methods-use-this
    public list () {}
  }

  beforeEach(() => {
    metadataStorage = container.resolve(MetadataStorage);
  });

  for (const decorator of [GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD, ALL]) {
    test(`${decorator.name} is pushed into the metadata storage`, () => {
      decorator('/')(Target.prototype, 'list');

      expect(metadataStorage.endpoints.some((e) => e.target === Target.prototype && e.propertyName === 'list' && e.method === decorator.name.toLowerCase() as any)).toStrictEqual(true);
    });
  }
});
