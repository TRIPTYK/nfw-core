
import type { AnyMiddleware } from '../../types/any-middleware.js';
import type { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: AnyMiddleware,
}
