import type { StringKeyOf } from 'type-fest';

export interface ControllerContext<T extends InstanceType<any> = InstanceType<any>> {
    controllerInstance: T,
    controllerAction: StringKeyOf<T>,
}
