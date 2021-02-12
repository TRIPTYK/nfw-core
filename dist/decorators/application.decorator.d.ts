import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { BaseService } from "../services/base.service";
import { Constructor } from "../types/global";
/**
 *
 * @param routeName
 */
export declare function RegisterApplication({ controllers, services, }: {
    controllers: Constructor<any>[];
    services: Constructor<BaseService>[];
}): ClassDecorator;
export declare function GlobalMiddleware(middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>, args?: any, order?: "before" | "after"): ClassDecorator;
