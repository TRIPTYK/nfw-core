import { ParamsHandleFunction } from "../storages/metadata/use-param.js";

export interface ParamInterface<T> {
    handle: ParamsHandleFunction<T>
}