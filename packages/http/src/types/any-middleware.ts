import type { Middleware } from '@koa/router';
import type { Class } from '@triptyk/nfw-core';
import type { MiddlewareInterface } from '../interfaces/middleware.interface.js';

export type AnyMiddleware = Class<MiddlewareInterface> | Middleware;
