"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = exports.toSnakeCase = exports.toKebabCase = void 0;
// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toKebabCase.md
const toKebabCase = (str) => str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("-");
exports.toKebabCase = toKebabCase;
// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toSnakeCase.md
const toSnakeCase = (str) => str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("_");
exports.toSnakeCase = toSnakeCase;
// https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/toCamelCase.md
const toCamelCase = (str) => {
    const s = str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join("");
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};
exports.toCamelCase = toCamelCase;
//# sourceMappingURL=case.util.js.map