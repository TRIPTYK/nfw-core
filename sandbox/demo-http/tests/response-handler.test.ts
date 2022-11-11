import 'reflect-metadata';
import type { RouterContext } from '@koa/router';
import { RestResponseHandler } from '../src/response-handler/rest.js';

test('Response is wrapped in data', async () => {
  const context = {
    body: undefined
  } as RouterContext;

  const fakeResponse = {
    username: 'hello'
  };

  const rh = new RestResponseHandler();

  await rh.handle(fakeResponse, {
    attachMeta: false
  }, context);

  expect(context.body).toStrictEqual({ data: fakeResponse, meta: undefined });
});
