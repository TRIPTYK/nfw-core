import { createDummyAcceptanceApp } from './apps/simple-api/application.js';
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('Application should listen to requests', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
  await new Promise((resolve, _reject) => server.close(resolve));
});

test('Application should have the users controller accessible', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      Authorization: '123'
    }
  });
  const body = await response.json();
  expect(response.status).toStrictEqual(200);
  expect(typeof body === 'object').toStrictEqual(true);
  await new Promise((resolve, _reject) => server.close(resolve));
});

test('Guard should refuse incorrect authorization with 403 code', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      Authorization: '123456'
    }
  });
  expect(response.status).toStrictEqual(403);
  const body = await response.text();
  expect(body).toStrictEqual('Wrong auth');
  await new Promise((resolve, _reject) => server.close(resolve));
});

test('Response handler should add meta to body response', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/users/Amaury', {
    headers: {
      Authorization: '123'
    }
  });
  expect(response.status).toStrictEqual(200);
  const body = await response.json() as Record<string, unknown>;
  expect(typeof body.meta).toStrictEqual('object');
  expect((body.meta as Record<string, string>).description).toStrictEqual('Nothing to say');
  await new Promise((resolve, _reject) => server.close(resolve));
});

test('Used response handler should be closest to route', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001/api/v1/users', {
    headers: {
      Authorization: '123'
    }
  });
  expect(response.status).toStrictEqual(200);
  const body = await response.json() as Record<string, unknown>;
  expect(typeof body.meta).toStrictEqual('object');
  expect((body.meta as Record<string, string>).description).toStrictEqual('Returns all users of the app');
  await new Promise((resolve, _reject) => server.close(resolve));
});
