import { Request } from 'koa';

export interface ControllerGuardContext {
    controllerInstance: unknown,
    controllerAction: string,
    request: Request,
    args?: unknown[],
}

export interface GuardInterface {
    can(context : ControllerGuardContext) : Promise<boolean> | boolean,
}
