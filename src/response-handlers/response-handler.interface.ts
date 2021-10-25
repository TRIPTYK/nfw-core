import { Response } from 'koa';

export interface ResponseHandlerContext {
    controllerInstance: unknown,
    controllerAction: string,
    response: Response,
    args?: unknown[],
}

export interface ResponseHandlerInterface {
    handle(controllerResponse: unknown, context : ResponseHandlerContext) : Promise<void> | void,
}
