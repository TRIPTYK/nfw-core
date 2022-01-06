import { RouterContext } from '@koa/router'
import { Next } from 'koa';
import { MiddlewareInterface } from '../../../../src/index.js';

export class Middleware implements MiddlewareInterface {
  async use (context: RouterContext, next: Next) {
    // eslint-disable-next-line no-console
    console.log(context.method, context.url, context.ip);
    await next();
  }
}
