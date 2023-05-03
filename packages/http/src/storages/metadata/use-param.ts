import type { RouterContext } from '@koa/router';
import { Constructor } from 'type-fest';
import { ParamInterface } from '../../interfaces/param.js';
import type { ControllerContextType } from '../../types/controller-context.js';

export interface ControllerParamsContext<TArgs, I = any> extends ControllerContextType<I> {
    args?: TArgs,
    ctx: RouterContext,
}

export type SpecialContextStrings = 'args' | 'controller-context';

export type ParamsHandleFunction<T> = ((ctx: ControllerParamsContext<T>) => Promise<unknown> | unknown);

export type CustomParams<T> = ParamsHandleFunction<T> | Constructor<ParamInterface<T>>;

export interface UseParamsMetadataArgs<T> {
    decoratorName: string,
    target: any,
    propertyName: string,
    index: number,
    handle: CustomParams<T> | SpecialContextStrings,
    args: T,
}
