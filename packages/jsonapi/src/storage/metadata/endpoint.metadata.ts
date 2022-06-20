export enum JsonApiMethod {
    GET,
    CREATE,
    UPDATE,
    LIST,
    DELETE
}

export interface EndpointMetadataArgs {
    target: unknown,
    propertyName: string,
    method: JsonApiMethod,
}
