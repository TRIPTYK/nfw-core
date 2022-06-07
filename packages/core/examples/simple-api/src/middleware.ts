import type { RouterContext } from '@koa/router'
import type { MiddlewareInterface } from '@triptyk/nfw-core';
import type { Next } from 'koa';

export class Middleware implements MiddlewareInterface {
  async use (context: RouterContext, next: Next) {
    // eslint-disable-next-line no-console
    console.log(context.method, context.url, context.ip);
    await next();
  }
}