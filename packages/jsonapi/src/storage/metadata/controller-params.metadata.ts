export interface ControllerActionParamsMetadataArgs {
    decoratorName: 'koa-context' | 'jsonapi-context' | 'service-response',
    target: any,
    propertyName: string,
    index: number,
}
