export interface ControllerContextInterface<T = unknown> {
    controllerInstance: T,
    controllerAction: keyof T,
}
