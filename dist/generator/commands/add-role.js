"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRole = void 0;
const camelcase = require("camelcase");
const pascalcase = require("pascalcase");
const project_1 = require("../utils/project");
const resources_1 = require("../static/resources");
async function addRole(roleName) {
    const controller = resources_1.resources("role").find((r) => r.template === "roles");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const enumDeclaration = controllerFile.getEnum("Roles");
    const tmp = enumDeclaration.getMember(pascalcase(roleName));
    if (!tmp) {
        const member = enumDeclaration.addMember({
            name: pascalcase(roleName),
            value: camelcase(roleName),
        });
    }
    else {
        throw new Error(`${roleName} already exist`);
    }
}
exports.addRole = addRole;
