import { RouterContext } from '@koa/router';

export interface UseParamsMetadataArgs {
    target: unknown,
    propertyKey: string,
    args?: unknown[],
    index: number,
    handle: (ctx: RouterContext, args: unknown[]) => unknown,
}
