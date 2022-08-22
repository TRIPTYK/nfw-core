import type { Class } from 'type-fest';
import type { QueryParser } from '../../query-parser/query-parser.js';

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
    queryParser?: Class<QueryParser<any>>,
}
