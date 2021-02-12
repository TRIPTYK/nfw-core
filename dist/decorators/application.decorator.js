"use strict";
/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMiddleware = exports.RegisterApplication = void 0;
/**
 *
 * @param routeName
 */
function RegisterApplication({ controllers, services }) {
    return function (target) {
        Reflect.defineMetadata("controllers", controllers, target);
        Reflect.defineMetadata("services", services, target);
    };
}
exports.RegisterApplication = RegisterApplication;
function GlobalMiddleware(middleware, args, order = "before") {
    return function (target) {
        if (Reflect.hasMetadata("middlewares", target)) {
            const middlewares = Reflect.getOwnMetadata("middlewares", target);
            middlewares.push({ middleware, args, order });
        }
        else {
            Reflect.defineMetadata("middlewares", [{ middleware, args, order }], target);
        }
    };
}
exports.GlobalMiddleware = GlobalMiddleware;
//# sourceMappingURL=application.decorator.js.map