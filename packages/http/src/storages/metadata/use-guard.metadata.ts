import type { Class } from '@triptyk/nfw-core';
import type { GuardInterface } from '../../interfaces/guard.interface.js';

export interface UseGuardMetadataArgs {
    target: any,
    propertyName?: string,
    args: unknown[],
    guard: Class<GuardInterface>,
}
