import { EntitySchema, MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { init } from '../../src/index.js';
import { jest } from '@jest/globals';
import('reflect-metadata');

jest.useFakeTimers();

interface Book {
    id: string,
}

test('database instance is registered and resolved correctly', async () => {
  const schema = new EntitySchema<Book>({
    name: 'book',
    properties: {
      id: { type: 'string', primary: true }
    }
  });

  const mikro = await init({
    dbName: ':memory:',
    type: 'sqlite',
    entities: [schema]
  });

  expect(mikro).toStrictEqual(container.resolve(MikroORM));
});
