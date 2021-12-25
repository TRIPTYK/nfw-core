import { Middleware } from '@koa/router';
import { MiddlewareInterface } from '../../interfaces/middleware.interface.js';
import { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: Class<MiddlewareInterface> | Middleware,
    type: 'classic' | 'not-found',
}
