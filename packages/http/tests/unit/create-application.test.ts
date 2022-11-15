/* eslint-disable max-statements */
/* eslint-disable class-methods-use-this */
import 'reflect-metadata';
import { singleton } from '@triptyk/nfw-core';
import Application from 'koa';
import { createRequest, createResponse } from 'node-mocks-http';
import { createApplication } from '../../src/factories/application.js';
import { Controller, GET } from '../../src/index.js';
import { jest } from '@jest/globals';
import { setTimeout } from 'node:timers/promises';

describe('Create application', () => {
  const spy = jest.fn();
    @Controller({
      routeName: '/hello'
    })
    @singleton()
  class Troller {
    @GET('/index')
      public index () {
        return spy();
      }
    }

    it('Setups a router from the controller that handle requests', async () => {
      const app = new Application();

      await createApplication(
        {
          controllers: [Troller],
          server: app
        }
      );

      app.callback()(
        createRequest({
          url: '/hello/index',
          method: 'GET',
          originalUrl: '/hello/index',
          baseUrl: '/hello/index'
        }),
        createResponse()
      );

      await setTimeout(100);

      expect(spy).toBeCalledTimes(1);
    });
});
