import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import { container } from '@triptyk/nfw-core';
import { ControllerActionBuilder, MetadataStorage } from '@triptyk/nfw-http';
import { UsersController } from '../src/controllers/users.js';
import { UsersService } from '../src/services/users.js';
import httpMocks from 'node-mocks-http';
import Application from 'koa';

function createFakeContext () {
  return {
    req: httpMocks.createRequest({
      method: 'GET'
    }),
    res: httpMocks.createResponse(),
    app: new Application(),
    query: {
      user: 'admin'
    },
    params: {
      name: 'amaury'
    },
    body: undefined
  } as unknown as RouterContext;
}

function setupServiceAndController () {
  const userService = container.resolve(UsersService);
  userService.users.push({
    name: 'amaury'
  });
  const controller = new UsersController(
    userService
  );
  return controller;
}

it('Whole action set ctx.body with correct data', async () => {
  const controller = setupServiceAndController();
  const action = new ControllerActionBuilder(
    {
      controllerAction: 'get',
      controllerInstance: controller
    },
    container.resolve(MetadataStorage)
  );

  const fakeContext = createFakeContext();

  await action.build()(
    fakeContext,
    async () => {}
  );

  expect(fakeContext.body).toStrictEqual({ data: { name: 'amaury' }, meta: undefined });
});
