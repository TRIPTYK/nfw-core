
import { ParamResolver } from '../resolvers/param-resolver.js';
import type { UseParamsMetadataArgs } from '../storages/metadata/use-param.js';
import type { ControllerContextType } from '../types/controller-context.js';

export function resolveParams (params: UseParamsMetadataArgs<unknown>[], controllerContext: ControllerContextType) {
  return params.map(({ handle, args }) => new ParamResolver(handle, controllerContext).resolve(args));
}
