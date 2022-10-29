import type { RouterContext } from '@koa/router';
import type { ResponseHandlerInterface } from '../interfaces/response-handler.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import { resolveParams } from './controller-action.js';

export interface ResponseHandlerInstanceMeta {
    instance: ResponseHandlerInterface,
    args: unknown[],
    paramsMeta: UseParamsMetadataArgs[],
  }

export async function executeResponseHandler (responseHandlerUseParams: ResponseHandlerInstanceMeta, propertyName: string, controllerInstance: any, ctx: RouterContext, controllerActionResult: any) {
  const resolvedHandlerParams = await resolveParams(responseHandlerUseParams!.paramsMeta, responseHandlerUseParams!.args, propertyName, controllerInstance, ctx);
  return responseHandlerUseParams!.instance.handle(controllerActionResult, ...resolvedHandlerParams);
}
