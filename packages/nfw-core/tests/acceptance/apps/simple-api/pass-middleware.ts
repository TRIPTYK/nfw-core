import type { RouterContext } from '@koa/router'
import type { Next } from 'koa';

export function createPassMiddleware (message: string) {
  return async (context: RouterContext, next: Next) => {
    (context.state.tab ??= []).push(message);
    await next();
  }
}
