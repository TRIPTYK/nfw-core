import { ResponseHandlerInterface } from '../../interfaces/response-handler.interface.js';
import { Class } from '../../types/class.js';

export interface UseResponseHandlerMetadataArgs {
    target: any,
    propertyName?: string,
    args?: unknown[],
    responseHandler: Class<ResponseHandlerInterface>,
}
