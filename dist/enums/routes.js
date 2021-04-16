"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validDecorators = exports.jsonApiRoutes = void 0;
exports.jsonApiRoutes = [
    {
        path: "/:id",
        methodType: "get",
        method: "get",
        middlewares: ["validation"],
    },
    {
        path: "/",
        methodType: "get",
        method: "list",
        middlewares: ["validation"],
    },
    {
        path: "/",
        methodType: "post",
        method: "create",
        middlewares: ["deserialize", "validation"],
    },
    {
        path: "/:id",
        methodType: "patch",
        method: "update",
        middlewares: ["deserialize", "validation"],
    },
    {
        path: "/:id",
        methodType: "delete",
        method: "remove",
        middlewares: ["validation"],
    },
    {
        path: "/:id/:relation",
        methodType: "get",
        method: "fetchRelated",
        middlewares: ["validation"],
    },
    {
        path: "/:id/relationships/:relation",
        methodType: "get",
        method: "fetchRelationships",
        middlewares: ["validation"],
    },
    {
        path: "/:id/relationships/:relation",
        methodType: "post",
        method: "addRelationships",
        middlewares: ["validation"],
    },
    {
        path: "/:id/relationships/:relation",
        methodType: "patch",
        method: "updateRelationships",
        middlewares: ["validation"],
    },
    {
        path: "/:id/relationships/:relation",
        methodType: "delete",
        method: "removeRelationships",
        middlewares: ["validation"],
    },
];
exports.validDecorators = ["Get", "Post", "Patch", "Delete"];
