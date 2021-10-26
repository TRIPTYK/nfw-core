import { Middleware } from 'koa';
import { MiddlewareInterface } from '../../middlewares/middleware.interface.js';
import { Class } from '../../types/class.js';

export interface UseMiddlewareMetadataArgs {
    target: Class<unknown> | unknown,
    propertyName?: string,
    middleware: Class<MiddlewareInterface> | Middleware,
}
