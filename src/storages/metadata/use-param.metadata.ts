import { RouterContext } from '@koa/router';

export interface ControllerParamsContext {
    controllerInstance: any,
    controllerAction: string,
    ctx: RouterContext,
    args?: unknown[],
}

export interface UseParamsMetadataArgs {
    decoratorName: string,
    target: any,
    propertyName: string,
    index: number,
    handle: ((ctx: ControllerParamsContext) => Promise<unknown> | unknown) | 'args' | 'controller-context',
}
