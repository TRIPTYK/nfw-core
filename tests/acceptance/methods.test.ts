import { createDummyAcceptanceApp } from './apps/simple-api/application.js';
import fetch from 'node-fetch';

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

async function requests (mustNotFail: string) {
  const url = `http://localhost:8001/api/v1/methods/${mustNotFail.toLowerCase()}`;
  const response = await fetch(url, {
    method: mustNotFail
  });

  expect(response.status).toStrictEqual(204);
  for (const httpMethod of methods.filter((m) => m !== mustNotFail)) {
    const response = await fetch(url, {
      method: httpMethod
    });
    expect(response.status).toStrictEqual(404);
  }
}

for (const method of methods) {
  /* eslint-disable no-undef */
  test(`Check HTTP ${method} method decorator`, async () => {
    const server = await createDummyAcceptanceApp(8001);
    await requests(method);
    await new Promise((resolve, _reject) => server.close(resolve));
  });
}
