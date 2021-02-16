"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationResponse = void 0;
const response_response_1 = require("./response.response");
class PaginationResponse extends response_response_1.Response {
    constructor(body, paginationData, { status, type } = {
        status: 200,
        type: "application/vnd.api+json",
    }) {
        super(body, { status, type });
        this.body = body;
        this.status = status;
        this.type = type;
        this.paginationData = paginationData;
    }
}
exports.PaginationResponse = PaginationResponse;
