export interface ResponseHandlerInterface {
    handle(lastResult: unknown, ...args: unknown[]) : Promise<void> | void,
}
