import type { RouterContext } from '@koa/router';
import httpMocks from 'node-mocks-http';

export function createKoaContext (): RouterContext {
  return {
    req: httpMocks.createRequest(),
    res: httpMocks.createResponse()
  };
}
