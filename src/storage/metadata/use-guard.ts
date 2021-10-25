import { GuardInterface } from '../../guards/guard.interface.js';
import { Class } from '../../types/class.js';

export interface UseGuardMetadataArgs {
    target: unknown,
    propertyName?: string,
    args?: unknown[],
    guard: Class<GuardInterface> | GuardInterface,
}
