import type { RouterContext } from '@koa/router';
import Application from 'koa';
import httpMocks from 'node-mocks-http';

export function createKoaContext (): RouterContext {
  return {
    req: httpMocks.createRequest(),
    res: httpMocks.createResponse(),
    app: new Application(),
    request: {} as any,
    response: {} as any,
    params: {},
    body: undefined,
    originalUrl: '',
    cookies: {} as any,
  } as unknown as RouterContext;
}
