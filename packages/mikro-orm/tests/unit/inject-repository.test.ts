import { container, injectable } from '@triptyk/nfw-core';
import { init, injectRepository } from '../../src/index.js';
import { jest } from '@jest/globals';
import { Entity, PrimaryKey, EntityRepository } from '@mikro-orm/core';
import('reflect-metadata');

jest.useFakeTimers();

test('repository is injected properly in class', async () => {
    @Entity()
  class Model {
      @PrimaryKey()
      public declare name: string;
    }

    @injectable()
    class InjectMe {
      public constructor (@injectRepository(Model) public repository: EntityRepository<Model>) {}
    }

    await init({
      dbName: ':memory:',
      type: 'sqlite',
      entities: [Model]
    });

    expect(container.resolve(InjectMe).repository).toBeInstanceOf(EntityRepository);
});
