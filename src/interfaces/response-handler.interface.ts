export interface ResponseHandlerInterface {
    type?: string,
    code?: number,
    handle(controllerResponse: unknown, ...args: unknown[]) : Promise<void> | void,
}
