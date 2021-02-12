"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipNotFoundError = void 0;
class RelationshipNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RelationshipNotFoundError = RelationshipNotFoundError;
