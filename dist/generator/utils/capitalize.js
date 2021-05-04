"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
function capitalize(input) {
    input = input.toLowerCase();
    return input.charAt(0).toUpperCase() + input.slice(1);
}
exports.capitalize = capitalize;
