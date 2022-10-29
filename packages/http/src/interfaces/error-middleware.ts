import type { RouterContext } from '@koa/router';

export interface ErrorHandlerInterface {
    handle(error: unknown, context: RouterContext) : void | Promise<void>,
}
