import { RouterContext } from '@koa/router';

export interface ControllerGuardContext {
    controllerInstance: unknown,
    controllerAction: string,
    ctx: RouterContext,
    args: unknown[],
}

export interface GuardInterface {
    can(context : ControllerGuardContext) : Promise<boolean> | boolean,
}
