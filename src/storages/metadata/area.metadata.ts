import type { Class } from '../../types/class.js';

export interface AreaMetadataArgs {
    target: Class<unknown>,
    routeName?: string,
    controllers: Class<unknown>[],
}
