
import type { Class } from 'type-fest';
import type { ResponseHandlerInterface } from '../../interfaces/response-handler.js';

export interface UseResponseHandlerMetadataArgs {
    target: any,
    propertyName?: string,
    args?: unknown[],
    responseHandler: Class<ResponseHandlerInterface>,
}
