import { RouterContext } from '@koa/router';
import { Next } from 'koa';

export interface MiddlewareInterface {
    use(context: RouterContext, next: Next) : void | Promise<void>,
}
