export interface ControllerActionParamsMetadataArgs {
    decoratorName: 'koa-context' | 'jsonapi-context' | 'body-as-resource',
    target: any,
    propertyName: string,
    index: number,
}
