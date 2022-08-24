import type { JsonApiOptions } from '../../decorators/jsonapi-endpoints.decorator.js';

export enum JsonApiMethod {
    GET,
    CREATE,
    UPDATE,
    LIST,
    DELETE,
    GET_RELATIONSHIPS,
    GET_RELATED
}

export interface EndpointMetadataArgs {
    target:unknown,
    propertyName: string,
    method: JsonApiMethod,
    options?: JsonApiOptions,
}
