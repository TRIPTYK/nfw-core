
export enum RouteMethod {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    PATCH = 'patch',
    OPTIONS = 'options',
    DELETE = 'delete',
    HEAD = 'head',
    ALL = 'all'
}

export interface EndpointMetadataArgs<T = unknown> {
    target: unknown,
    propertyName: string,
    method: RouteMethod,
    args: T,
}
