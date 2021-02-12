"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_response_1 = require("./response.response");
class PaginationResponse extends response_response_1.default {
    constructor(body, paginationData, { status, type } = {
        status: 200,
        type: "application/vnd.api+json"
    }) {
        super(body, { status, type });
        this.body = body;
        this.status = status;
        this.type = type;
        this.paginationData = paginationData;
    }
}
exports.default = PaginationResponse;
//# sourceMappingURL=pagination.response.js.map