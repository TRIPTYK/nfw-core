import { BaseController } from "../controllers/base.controller";
import { MiddlewareMetadata } from "../decorators/controller.decorator";
import { Constructor } from "../types/global";

export interface ApplicationInterface {
  init(): Promise<any>;
  setupControllers(controllers: Constructor<BaseController>[],baseRoute?: string): Promise<any>;
  afterInit(): Promise<any>;
  listen(port: number);
}
