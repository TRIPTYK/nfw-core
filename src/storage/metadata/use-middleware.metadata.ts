import { Middleware } from 'koa';
import { MiddlewareInteface } from '../../middlewares/middleware.interface.js';
import { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<unknown> | unknown,
    propertyName?: string,
    middleware: Class<MiddlewareInteface> | Middleware,
    type: 'classic' | 'not-found',
}
