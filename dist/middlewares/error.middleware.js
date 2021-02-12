"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const Boom = require("@hapi/boom");
const JSONAPISerializer = require("json-api-serializer");
const tsyringe_1 = require("tsyringe");
const case_util_1 = require("../utils/case.util");
const base_error_middleware_1 = require("./base.error-middleware");
let ErrorMiddleware = class ErrorMiddleware extends base_error_middleware_1.BaseErrorMiddleware {
    constructor() {
        super(...arguments);
        this.serializer = new JSONAPISerializer();
    }
    use(error, req, res, next, args) {
        if (Array.isArray(error)) {
            const errs = error;
            const allErrors = [];
            for (const err of errs) {
                for (const suberror of err) {
                    const err = {
                        detail: `${suberror.msg} for ${suberror.param} in ${suberror.location}, value is ${suberror.value}`,
                        title: "Validation Error",
                        source: {},
                        meta: {
                            param: case_util_1.toCamelCase(suberror.param),
                            msg: suberror.msg,
                            location: suberror.location
                        },
                        status: "400"
                    };
                    if (["query", "params"].includes(suberror.location)) {
                        err.source.parameter = case_util_1.toCamelCase(suberror.param);
                    }
                    if (suberror.location === "body") {
                        err.source.pointer = `/data/attributes/${case_util_1.toCamelCase(suberror.param)}`;
                    }
                    allErrors.push(err);
                }
            }
            res.status(400);
            res.json(this.serializer.serializeError(allErrors));
            return;
        }
        if (!error.isBoom) {
            error = Boom.internal(error.message);
        }
        res.status(error.output.statusCode);
        res.json(this.serializer.serializeError({
            detail: error.message,
            status: error.output.statusCode
        }));
    }
};
ErrorMiddleware = __decorate([
    tsyringe_1.singleton()
], ErrorMiddleware);
exports.default = ErrorMiddleware;
