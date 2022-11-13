import { ParamResolver } from '../routing/param-resolver.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { ControllerContext } from '../types/controller-context.js';

export function resolveParams (params: UseParamsMetadataArgs[], controllerContext: ControllerContext) {
  return params.map(({ handle, args }) => new ParamResolver(handle, controllerContext).resolve(args));
}
