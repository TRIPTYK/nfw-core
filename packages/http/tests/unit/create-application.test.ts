/* eslint-disable max-classes-per-file */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable max-statements */
/* eslint-disable class-methods-use-this */
import 'reflect-metadata';
import { singleton } from '@triptyk/nfw-core';
import Application from 'koa';
import { createRequest, createResponse } from 'node-mocks-http';
import { createApplication } from '../../src/factories/create-application.js';
import { Controller, GET } from '../../src/index.js';
import { describe, expect, it, vi } from 'vitest';
import { setTimeout } from 'node:timers/promises';

describe('Create application', () => {
  const spy = vi.fn();

  @Controller({
    routeName: '/hello',
  })
  @singleton()
  class Troller {
  @GET('/index')
    public index () {
      return spy();
    }
  }

  @Controller({
    routeName: '/api/v1',
    controllers: [Troller],
  })
  @singleton()
  class Area {}

  it('Setups a router from the controller that handle requests', async () => {
    const app = new Application();

    await createApplication(
      {
        controllers: [Area],
        server: app,
      },
    );

    app.callback()(
      createRequest({
        url: '/api/v1/hello/index',
        method: 'GET',
        originalUrl: '/api/v1/hello/index',
        baseUrl: '/api/v1/hello/index',
      }),
      createResponse() as never,
    );

    await setTimeout(100);

    expect(spy).toBeCalledTimes(1);
  });
});
