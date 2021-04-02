"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const project_1 = require("../utils/project");
async function save() {
    console.log("Je save");
    await project_1.default.save();
}
exports.save = save;
