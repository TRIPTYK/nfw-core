import type Router from '@koa/router';
import HttpError from 'http-errors';

export const allowedMethods = (router: Router) => router.allowedMethods({
  throw: true,
  notImplemented: () => new HttpError.NotImplemented(),
  methodNotAllowed: () => new HttpError.MethodNotAllowed()
});
