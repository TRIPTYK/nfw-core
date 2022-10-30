
export enum HttpMethod {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    PATCH = 'patch',
    OPTIONS = 'options',
    DELETE = 'delete',
    HEAD = 'head',
    ALL = 'all'
}

export interface HttpEndpointMetadataArgs {
    target: unknown,
    propertyName: string,
    method: HttpMethod,
    args: {
        routeName: string,
    },
}
