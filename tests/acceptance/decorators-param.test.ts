import { createDummyAcceptanceApp } from './apps/simple-api/application.js';
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('Check all decorators', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/decorators/1/2?q1=hello');
  expect(response.status).toStrictEqual(200);

  const body = await response.json() as Record<string, any>;

  expect(body.ip).toStrictEqual("::ffff:127.0.0.1");
  expect(body.method).toStrictEqual("GET");
  expect(body.origin).toStrictEqual("http://localhost:8001");
  expect(body.param1).toStrictEqual("1");
  expect(body.param2).toStrictEqual("2");
  expect(body.q1).toStrictEqual("hello");
  expect(typeof body.params).toStrictEqual("object");
  expect(typeof body.query).toStrictEqual("object");
  expect(typeof body.ctx).toStrictEqual("object");

  await new Promise((resolve, _reject) => server.close(resolve));
});

test('Check controller context decorator', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/decorators/context');
  expect(response.status).toStrictEqual(200);

  const body = await response.json() as Record<string, any>;

  expect(body.controllerAction).toStrictEqual("context");
  expect(body.controllerInstance).toStrictEqual("DecoratorsController");

  await new Promise((resolve, _reject) => server.close(resolve));
});