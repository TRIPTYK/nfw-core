import 'reflect-metadata';
import { NFWRegistry } from '../src/registry.js';
import { ResourceSerializer } from '../src/serializers/resource.js';

class UsersSerializer extends ResourceSerializer {}

test('Register serializer in registry for resource', () => {
  const registry = new NFWRegistry();
  registry.registerSerializerFor('articles', UsersSerializer);
  expect(registry.serializerFor('articles')).toBeInstanceOf(UsersSerializer);
});
