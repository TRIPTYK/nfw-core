import type { RouterContext } from '@koa/router';
import { Constructor } from 'type-fest';
import { ParamInterface } from '../../interfaces/param.js';
import type { ControllerContextType } from '../../types/controller-context.js';

export interface ControllerParamsContext<T> extends ControllerContextType<T> {
    args?: unknown[],
    ctx: RouterContext,
}

export type SpecialContextStrings = 'args' | 'controller-context';

export type ParamsHandleFunction<T> = ((ctx: ControllerParamsContext<T>) => Promise<unknown> | unknown);

export type CustomParams = ParamsHandleFunction<unknown> | Constructor<ParamInterface<unknown>>;

export interface UseParamsMetadataArgs {
    decoratorName: string,
    target: any,
    propertyName: string,
    index: number,
    handle: CustomParams | SpecialContextStrings,
    args: unknown[],
}
