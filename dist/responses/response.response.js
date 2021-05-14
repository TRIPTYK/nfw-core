"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Response {
    constructor(body, { status, type } = {
        status: 200,
        type: "application/vnd.api+json",
    }) {
        this.body = body;
        this.status = status;
        this.type = type;
    }
}
exports.Response = Response;
