import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';

export interface MiddlewareInterface {
    use(context: RouterContext, next: Next) : void | Promise<void>,
}
