"use strict";
/*
    Global validation elements like ids , ...
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationships = void 0;
exports.relationships = {
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'wrong id format'
    },
    relation: {
        in: ['params'],
        isString: true,
        errorMessage: 'wrong relationship format'
    }
};
