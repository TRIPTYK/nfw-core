import { RouterContext } from '@koa/router';

export interface ResponseHandlerContext {
    controllerInstance: unknown,
    controllerAction: string,
    ctx: RouterContext,
    args?: unknown[],
}

export interface ResponseHandlerInterface {
    handle(...args: unknown[]) : Promise<void> | void,
}
