import type { ParamsHandleFunction } from '../storages/metadata/use-param.js';
import type { ControllerContextType } from './controller-context.js';

export type ResolvedParamType = ControllerContextType<unknown> | unknown[] | ParamsHandleFunction<any>;
