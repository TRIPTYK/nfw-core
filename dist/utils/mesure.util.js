"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mesure = void 0;
async function mesure(expression) {
    const startTime = Date.now();
    await expression();
    return Date.now() - startTime;
}
exports.mesure = mesure;
