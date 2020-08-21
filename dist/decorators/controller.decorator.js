"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const typeorm_1 = require("typeorm");
function Controller({ repository }) {
    return function (constructor) {
        constructor.prototype.repository = typeorm_1.getCustomRepository(repository);
    };
}
exports.Controller = Controller;
