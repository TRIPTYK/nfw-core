"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RelationshipNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.default = RelationshipNotFoundError;
