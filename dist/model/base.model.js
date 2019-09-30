"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    constructor(payload = {}) {
        Object.assign(this, payload);
    }
}
exports.BaseModel = BaseModel;
