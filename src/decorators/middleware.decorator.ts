
import { BaseErrorMiddleware, BaseMiddleware, Constructor } from "..";
import { getMetadataStorage } from "../metadata/metadata-storage";

export function Middleware() {
  return function(target: Constructor<BaseMiddleware | BaseErrorMiddleware>): void {
    getMetadataStorage().middlewares.push({
      target
    });
  }
}

export function GlobalMiddleware({
  priority,
  args
} : {
  priority: number,
  args?: unknown
}) {
  return function(target: Constructor<BaseMiddleware | BaseErrorMiddleware>): void {
    getMetadataStorage().middlewares.push({
      target
    });
    getMetadataStorage().useMiddlewares.push({
      priority,
      target,
      middleware: target,
      level: "application",
      args,
      type: target.constructor === BaseMiddleware ?  "classic" : "error"
    })
  }
}