"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Put = exports.Patch = exports.Post = exports.Get = exports.OverrideValidator = exports.OverrideSerializer = exports.JsonApiMethodMiddleware = exports.MethodMiddleware = exports.RouteMiddleware = exports.JsonApiController = exports.Controller = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const tsyringe_1 = require("tsyringe");
/**
 *
 * @param routeName
 */
function Controller(routeName) {
    return function (target) {
        tsyringe_1.container.registerSingleton(target);
        Reflect.defineMetadata("routeName", routeName, target);
        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
}
exports.Controller = Controller;
/**
 *
 * @param routeName
 */
function JsonApiController(entity) {
    return function (target) {
        tsyringe_1.container.registerSingleton(target);
        Reflect.defineMetadata("entity", entity, target.prototype);
        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
}
exports.JsonApiController = JsonApiController;
function RouteMiddleware(middlewareClass, args) {
    return function (target) {
        if (!Reflect.hasMetadata("middlewares", target)) {
            Reflect.defineMetadata("middlewares", [], target);
        }
        const middlewares = Reflect.getMetadata("middlewares", target);
        middlewares.push({ middleware: middlewareClass, args });
    };
}
exports.RouteMiddleware = RouteMiddleware;
function MethodMiddleware(middlewareClass, args) {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata("middlewares", target.constructor, propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor, propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor, propertyKey);
        middlewares.push({ middleware: middlewareClass, args });
    };
}
exports.MethodMiddleware = MethodMiddleware;
function JsonApiMethodMiddleware(middlewareClass, args, order = "afterAll") {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata("middlewares", target.constructor, propertyKey)) {
            Reflect.defineMetadata("middlewares", [], target.constructor, propertyKey);
        }
        const middlewares = Reflect.getMetadata("middlewares", target.constructor, propertyKey);
        middlewares.push({ middleware: middlewareClass, args, order });
    };
}
exports.JsonApiMethodMiddleware = JsonApiMethodMiddleware;
function OverrideSerializer(schema = "default") {
    return function (target, propertyKey) {
        Reflect.defineMetadata("deserializer", schema, target.constructor, propertyKey);
        Reflect.defineMetadata("schema-use", schema, target, propertyKey);
    };
}
exports.OverrideSerializer = OverrideSerializer;
function OverrideValidator(schema) {
    return function (target, propertyKey) {
        Reflect.defineMetadata("validator", schema, target.constructor, propertyKey);
    };
}
exports.OverrideValidator = OverrideValidator;
const registerMethod = (path = null, method) => function (target, propertyKey) {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
    }
    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata("routes", target.constructor);
    const alreadyExists = routes.findIndex((route) => route.methodName === propertyKey);
    if (alreadyExists >= 0) {
        routes.splice(alreadyExists, 1);
    }
    routes.push({
        methodName: propertyKey,
        path: path ? path : `/${propertyKey}`,
        requestMethod: method
    });
};
function Get(path = null) {
    return registerMethod(path, "get");
}
exports.Get = Get;
function Post(path = null) {
    return registerMethod(path, "post");
}
exports.Post = Post;
function Patch(path = null) {
    return registerMethod(path, "patch");
}
exports.Patch = Patch;
function Put(path = null) {
    return registerMethod(path, "put");
}
exports.Put = Put;
function Delete(path = null) {
    return registerMethod(path, "delete");
}
exports.Delete = Delete;
