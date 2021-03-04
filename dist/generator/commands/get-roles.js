"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../utils/project");
const resources_1 = require("../static/resources");
async function getRoles() {
    const controller = resources_1.resources("role").find((r) => r.template === "roles");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const enumDeclaration = controllerFile.getEnum("Roles");
    if (!enumDeclaration) {
        throw new Error("This enums does not exit");
    }
    const members = enumDeclaration.getMembers();
    const array = [];
    for (const member of members) {
        array.push(member.getName());
    }
    return array;
}
exports.default = getRoles;
