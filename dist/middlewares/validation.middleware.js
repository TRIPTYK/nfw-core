"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const tsyringe_1 = require("tsyringe");
const base_middleware_1 = require("./base.middleware");
let ValidationMiddleware = class ValidationMiddleware extends base_middleware_1.BaseMiddleware {
    async use(req, response, next, args) {
        const { schema, location = ["body"] } = args;
        const validationChain = express_validator_1.checkSchema(schema, location);
        const res = await Promise.all(validationChain.map((validation) => validation.run(req)));
        const errors = [];
        for (const r of res) {
            if (r.array().length) {
                errors.push(r.array());
            }
        }
        if (errors.length !== 0) {
            return next(errors);
        }
        return next();
    }
};
ValidationMiddleware = __decorate([
    tsyringe_1.singleton()
], ValidationMiddleware);
exports.default = ValidationMiddleware;
//# sourceMappingURL=validation.middleware.js.map