import { Middleware } from 'koa';
import { MiddlewareInterface } from '../../interfaces/middleware.interface.js';
import { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<any> | any,
    propertyName?: string,
    middleware: Class<MiddlewareInterface> | Middleware,
    type: 'classic' | 'not-found',
}
