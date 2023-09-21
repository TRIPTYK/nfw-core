import type { HttpMethod } from '../../enums/http-method.js';

export interface HttpEndpointMetadataArgs {
    target: unknown,
    propertyName: string,
    method: HttpMethod,
    args: {
        routeName: string,
    },
}
