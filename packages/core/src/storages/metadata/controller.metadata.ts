import type { BuilderInterface } from '../../interfaces/builder.interface.js';
import type { Class } from '../../types/class.js';

export interface ControllerMetadataArgs {
    target: Class<unknown>,
    controllers?: Class<unknown>[],
    builder?: Class<BuilderInterface>,
    args: unknown[],
    routing?: {
        prefix?: string,
        methods?: string[],
        sensitive? : boolean,
        strict?: boolean,
    },
}
