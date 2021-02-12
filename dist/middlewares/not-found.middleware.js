"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONAPISerializer = require("json-api-serializer");
const tsyringe_1 = require("tsyringe");
const base_middleware_1 = require("./base.middleware");
let NotFoundMiddleware = class NotFoundMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super(...arguments);
        this.serializer = new JSONAPISerializer();
    }
    use(req, res, next, args) {
        res.status(404);
        res.json(this.serializer.serializeError({
            detail: "Not found",
            status: "404"
        }));
    }
};
NotFoundMiddleware = __decorate([
    tsyringe_1.singleton()
], NotFoundMiddleware);
exports.default = NotFoundMiddleware;
//# sourceMappingURL=not-found.middleware.js.map