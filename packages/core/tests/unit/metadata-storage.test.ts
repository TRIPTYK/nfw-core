import 'reflect-metadata';
import { MetadataStorage } from '../../src/index.js'

test('Metadata storage is cleared', async () => {
  const instance = MetadataStorage.instance;
  MetadataStorage.instance.controllers.push({
    target: class {}
  });
  expect(instance.controllers.length).toStrictEqual(1);
  expect(MetadataStorage.instance).toStrictEqual(instance);
  MetadataStorage.clear();
  expect(MetadataStorage.instance).not.toStrictEqual(instance);
})
