import type { RouterContext } from '@koa/router';
import type { ControllerContext } from '../../types/controller-context.js';

export interface ControllerParamsContext<T> extends ControllerContext<T> {
    args?: unknown[],
    ctx: RouterContext,
}

export type ParamsHandleFunction<T> = ((ctx: ControllerParamsContext<T>) => Promise<unknown> | unknown);

export interface UseParamsMetadataArgs {
    decoratorName: string,
    target: any,
    propertyName: string,
    index: number,
    handle: ParamsHandleFunction<unknown> | 'args' | 'controller-context',
    args: unknown[],
}
