import { Class } from '../../types/class.js';

export interface ControllerMetadataArgs {
    target: Class<unknown>,
    routeName: string,
}
