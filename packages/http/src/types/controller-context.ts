export interface ControllerContext<T = unknown> {
    controllerInstance: T,
    controllerAction: keyof T,
}
