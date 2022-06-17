import type { Class } from '@triptyk/nfw-core';
import type { ErrorHandlerInterface } from '../../interfaces/error-middleware.interface.js';

export interface UseErrorHandlerMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    errorHandler: Class<ErrorHandlerInterface>,
}
