import 'reflect-metadata';
import { RouterMetadataNotFoundError } from '../../src/errors/router-metadata-not-found.js';
import { MetadataStorage } from '../../src/storages/metadata-storage.js';

describe('Metadata storage', () => {
  class Target {}

  let metadataStorage: MetadataStorage;

  beforeEach(() => {
    metadataStorage = new MetadataStorage();
  });

  it('Throws error when no route metadata is found for target', () => {
    expect(() => metadataStorage.findRouteForTarget(class {})).toThrowError(RouterMetadataNotFoundError);
  });
  it('Retreives correct metadata from target', () => {
    const routeMeta = {
      target: Target,
      controllers: [],
      args: [],
      builder: class {} as any
    };
    metadataStorage.routes.push(routeMeta);
    expect(metadataStorage.findRouteForTarget(Target)).toStrictEqual(routeMeta);
  });
});
