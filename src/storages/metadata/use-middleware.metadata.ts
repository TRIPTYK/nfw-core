import type { Middleware } from '@koa/router';
import type { MiddlewareInterface } from '../../interfaces/middleware.interface.js';
import type { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: Class<MiddlewareInterface> | Middleware,
    type: 'classic' | 'not-found',
}
