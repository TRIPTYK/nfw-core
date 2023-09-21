import type { Class } from 'type-fest';
import type { GuardInterface } from '../../interfaces/guard.js';

export interface UseGuardMetadataArgs {
    target: any,
    propertyName?: string,
    args: unknown[],
    guard: Class<GuardInterface>,
}
