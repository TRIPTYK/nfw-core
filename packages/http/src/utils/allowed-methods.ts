import type Router from '@koa/router';

export const allowedMethods = (router: Router) => router.allowedMethods({
  throw: true
});
