import 'reflect-metadata';
import { EntitySchema, MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { init } from '../../src/index.js';
import { test, expect } from 'vitest';

interface Book {
    id: string,
}

test('database instance is registered and resolved correctly', async () => {
  const schema = new EntitySchema<Book>({
    name: 'book',
    properties: {
      id: { type: 'string', primary: true },
    },
  });

  const mikro = await init({
    dbName: ':memory:',
    entities: [schema],
  }, 'sqlite');

  expect(mikro).toStrictEqual(container.resolve(MikroORM));
});
