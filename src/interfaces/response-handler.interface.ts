export interface ResponseHandlerInterface {
    handle(controllerResponse: unknown, ...args: unknown[]) : Promise<void> | void,
}
