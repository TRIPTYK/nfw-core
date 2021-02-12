"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBool = exports.booleanMap = void 0;
exports.booleanMap = {
    0: false,
    1: true,
    false: false,
    no: false,
    true: true,
    yes: true
};
function parseBool(string) {
    return exports.booleanMap[string] === undefined ? false : exports.booleanMap[string];
}
exports.parseBool = parseBool;
//# sourceMappingURL=string-parse.util.js.map