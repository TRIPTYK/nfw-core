
import 'reflect-metadata';
import { jest } from '@jest/globals';
import { ControllerActionBuilder } from '../../../src/routing/controller-action.js';
import { MetadataStorage } from '../../../src/storages/metadata-storage.js';
import type { RouterContext } from '@koa/router';

describe('Action builder', () => {
  test('It builds a middleware', async () => {
    const listFn = jest.fn();
    const next = jest.fn(async () => {});

    class Controller {
      public list = listFn;
    }

    const instance = new Controller();
    const storage = new MetadataStorage();

    const actionBuilder = new ControllerActionBuilder(instance, storage);
    const actionMiddleware = actionBuilder.handleHttpRouteControllerAction(Controller, 'list');

    await actionMiddleware(createMockContext() as RouterContext, next);
    expect(listFn).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(0);
  });
});
