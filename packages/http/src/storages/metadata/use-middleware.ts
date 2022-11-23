
import type { Class } from 'type-fest';
import type { AnyMiddlewareType } from '../../types/any-middleware.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: AnyMiddlewareType,
}
