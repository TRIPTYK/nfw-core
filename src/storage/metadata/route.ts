
export enum RouteMethod {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    PATCH = 'patch',
    OPTIONS = 'options',
    DELETE = 'delete',
    ALL = 'all'
}

export interface RouteMetadataArgs {
    target: unknown,
    propertyKey: string,
    method: RouteMethod,
    routeName: string,
}
