/* eslint-disable class-methods-use-this */
import Application from 'koa';
import 'reflect-metadata';
import { expect, test } from 'vitest';
import { Controller, MetadataStorage, POST, createApplication, createCustomDecorator } from '../../src/index.js';
import { container } from '@triptyk/nfw-core';

const rejects = createCustomDecorator(() => Promise.reject(new Error('test')), 'rejects');

@Controller({
  routeName: '/test',
})
class C {
  @POST('/')
  public test (@rejects reject: string) {
    return 'test';
  };
}

test('gets registered actions', async () => {
  const app = new Application();

  await createApplication(
    {
      controllers: [C],
      server: app,
    },
  );

  const action = container.resolve(MetadataStorage).getControllerActionForEndpoint(C, 'test');

  expect(action('')).rejects.toThrowError('test');
});
