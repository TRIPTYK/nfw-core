import type { Class } from '../../types/class.js';

export interface ControllerMetadataArgs {
    target: Class<unknown>,
    controllers?: Class<unknown>[],
    routing?: {
        prefix?: string,
        methods?: string[],
        sensitive? : boolean,
        strict?: boolean,
    },
}
