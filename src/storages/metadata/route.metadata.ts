/* eslint-disable no-unused-vars */

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

export interface RouteMetadataArgs {
    target: any,
    propertyName: string,
    method: RouteMethod,
    routeName: string,
}
