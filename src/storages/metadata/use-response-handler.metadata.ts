import type { ResponseHandlerInterface } from '../../interfaces/response-handler.interface.js';
import type { Class } from '../../types/class.js';

export interface UseResponseHandlerMetadataArgs {
    target: any,
    propertyName?: string,
    args?: unknown[],
    responseHandler: Class<ResponseHandlerInterface>,
}
