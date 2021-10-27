import { RouterContext } from '@koa/router';

export interface UseParamsMetadataArgs {
    target: unknown,
    propertyName: string,
    args: unknown[],
    index: number,
    handle: (ctx: RouterContext, args: unknown[]) => Promise<unknown> | unknown,
}
