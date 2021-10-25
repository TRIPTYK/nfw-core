import { RouterContext } from '@koa/router';

export interface ControllerRouteContext {
    controllerInstance: unknown,
    controllerAction: string,
    routerContext: RouterContext,
}

export interface GuardInterface {
    can(context : ControllerRouteContext) : Promise<boolean> | boolean,
}
