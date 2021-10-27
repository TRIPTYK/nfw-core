import { GuardInterface } from '../../interfaces/guard.interface.js';
import { Class } from '../../types/class.js';

export interface UseGuardMetadataArgs {
    target: any,
    propertyName?: string,
    args?: unknown[],
    guard: Class<GuardInterface>,
}
