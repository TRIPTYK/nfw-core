"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("camelcase");
const pascalcase = require("pascalcase");
const project_1 = require("../utils/project");
async function addRole(roleName) {
    const file = project_1.default.getSourceFileOrThrow("src/api/enums/role.enum.ts");
    const enumDeclaration = file.getEnum("Roles");
    const tmp = enumDeclaration.getMember(pascalcase(roleName));
    if (!tmp) {
        const member = enumDeclaration.addMember({
            name: pascalcase(roleName),
            value: camelcase(roleName)
        });
    }
    else {
        throw new Error(`${roleName} already exist`);
    }
}
exports.default = addRole;
