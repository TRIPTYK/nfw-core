import { Class } from '../../types/class.js';

export interface ControllerMetadataArgs {
    target: Class<any>,
    routeName: string,
}
