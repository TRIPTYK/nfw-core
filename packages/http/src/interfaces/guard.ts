import type { RouterContext } from '@koa/router';

export interface ControllerGuardContext {
    controllerInstance: unknown,
    controllerAction: string,
    ctx: RouterContext,
    args: unknown[],
}

export interface GuardInterface {
    can(...args: unknown[]) : Promise<boolean> | boolean,
}
