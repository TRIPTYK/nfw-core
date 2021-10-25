export enum ParamType {
    BODY,
    REQUEST,
    RESPONSE,
    PARAM,
    PARAMS,
    QUERY,
    QUERYPARAM,
    HEADER,
    HEADERS,
    CUSTOM,
}

export interface UseParamsMetadataArgs {
    target: unknown,
    propertyKey: string,
    paramType: ParamType,
    args?: unknown[],
    index: number,
}
