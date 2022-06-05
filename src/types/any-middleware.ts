import { Middleware } from "@koa/router";
import { Class } from "./class.js";
import { MiddlewareInterface } from "../interfaces/middleware.interface.js";

export type AnyMiddleware = Class<MiddlewareInterface> | Middleware;
