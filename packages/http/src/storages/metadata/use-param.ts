import type { RouterContext } from '@koa/router';

export interface ControllerParamsContext {
    controllerInstance: any,
    controllerAction: string,
    ctx: RouterContext,
    args?: unknown[],
}

export type ParamsHandleFunction = ((ctx: ControllerParamsContext) => Promise<unknown> | unknown);

export interface UseParamsMetadataArgs {
    decoratorName: string,
    target: any,
    propertyName: string,
    index: number,
    handle: ParamsHandleFunction | 'args' | 'controller-context',
    args: unknown[],
}
