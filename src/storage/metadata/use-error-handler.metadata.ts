import { ErrorHandlerInterface } from '../../error-handler/error-middleware.interface.js';
import { Class } from '../../types/class.js';

export interface UseErrorHandlerMetadataArgs {
    target: Class<unknown> | unknown,
    propertyName?: string,
    errorHandler: Class<ErrorHandlerInterface>,
}
