import { createDummyAcceptanceApp } from './apps/simple-api/application.js';
import fetch from 'node-fetch';

/* eslint-disable no-undef */
test('application should listen to requests', async () => {
  const server = await createDummyAcceptanceApp(8001);

  const response = await fetch('http://localhost:8001');
  expect(response.status).toStrictEqual(404);
  await new Promise((resolve, _reject) => server.close(resolve));
});
