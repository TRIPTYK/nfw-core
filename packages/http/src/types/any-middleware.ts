import type { Middleware } from '@koa/router';
import type { Class } from 'type-fest';
import type { MiddlewareInterface } from '../interfaces/middleware.js';

export type AnyMiddlewareType = Class<MiddlewareInterface> | Middleware;
