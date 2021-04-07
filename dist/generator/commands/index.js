"use strict";
// created from 'create-ts-index'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./add-column"), exports);
__exportStar(require("./add-endpoint"), exports);
__exportStar(require("./add-permission"), exports);
__exportStar(require("./add-relation"), exports);
__exportStar(require("./add-role"), exports);
__exportStar(require("./delete-entity"), exports);
__exportStar(require("./delete-role"), exports);
__exportStar(require("./delete-route"), exports);
__exportStar(require("./generate-entity"), exports);
__exportStar(require("./generate-route"), exports);
__exportStar(require("./get-entityRoutes"), exports);
__exportStar(require("./get-perms"), exports);
__exportStar(require("./get-roles"), exports);
__exportStar(require("./remove-column"), exports);
__exportStar(require("./delete-endpoint"), exports);
__exportStar(require("./remove-permissions"), exports);
__exportStar(require("./remove-relation"), exports);
__exportStar(require("./save"), exports);
