import { RouterContext } from '@koa/router';

export interface ControllerParamsContext {
    controllerInstance: unknown,
    controllerAction: string,
    ctx: RouterContext,
    args?: unknown[],
}

export interface UseParamsMetadataArgs {
    target: unknown,
    propertyName: string,
    index: number,
    handle: (ctx: ControllerParamsContext) => Promise<unknown> | unknown,
}
