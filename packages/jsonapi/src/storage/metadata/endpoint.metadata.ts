import type { HttpMethod } from '@triptyk/nfw-http';

export interface EndpointMetadataArgs {
    target: unknown,
    propertyName: string,
    method: HttpMethod,
}
