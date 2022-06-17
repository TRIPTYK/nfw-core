import type { Class } from '@triptyk/nfw-core';
import type { ResponseHandlerInterface } from '../../interfaces/response-handler.interface.js';

export interface UseResponseHandlerMetadataArgs {
    target: any,
    propertyName?: string,
    args?: unknown[],
    responseHandler: Class<ResponseHandlerInterface>,
}
