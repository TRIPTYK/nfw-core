import { RouterContext } from '@koa/router'
import { injectable, MiddlewareInterface } from '@triptyk/nfw-core';
import { Next } from 'koa';

@injectable()
export class LogMiddleware implements MiddlewareInterface {
  async use (context: RouterContext, next: Next) {
    // eslint-disable-next-line no-console
    console.log(context.method, context.url, context.ip);
    await next();
  }
}
