
import type { Class } from '@triptyk/nfw-core';
import type { AnyMiddleware } from '../../types/any-middleware.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: AnyMiddleware,
}
