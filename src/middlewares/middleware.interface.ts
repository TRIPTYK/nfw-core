import { RouterContext } from '@koa/router';
import { Next } from 'koa';

export interface MiddlewareInteface {
    use(context: RouterContext, next: Next) : void | Promise<void>,
}
