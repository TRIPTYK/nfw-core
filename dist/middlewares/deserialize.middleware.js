"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const base_middleware_1 = require("./base.middleware");
let DeserializeMiddleware = class DeserializeMiddleware extends base_middleware_1.BaseMiddleware {
    async use(req, response, next, args) {
        if (!req.body.data) {
            return next();
        }
        const fields = await tsyringe_1.container
            .resolve(args.serializer)
            .deserialize(req.body);
        req.body = {};
        for (const key in fields) {
            if (key !== "id") {
                req.body[key] = fields[key];
            }
            else {
                delete req.body[key];
            }
        }
        return next();
    }
};
DeserializeMiddleware = __decorate([
    tsyringe_1.singleton()
], DeserializeMiddleware);
exports.default = DeserializeMiddleware;
