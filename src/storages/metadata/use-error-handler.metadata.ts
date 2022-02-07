import type { ErrorHandlerInterface } from '../../interfaces/error-middleware.interface.js';
import type { Class } from '../../types/class.js';

export interface UseErrorHandlerMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    errorHandler: Class<ErrorHandlerInterface>,
}
