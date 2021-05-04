"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = void 0;
const pascalcase = require("pascalcase");
const project_1 = require("../utils/project");
const resources_1 = require("../static/resources");
const get_roles_1 = require("./get-roles");
async function deleteRole(roleName) {
    if (!(await get_roles_1.getRoles()).find(v => v === roleName))
        throw new Error(`Role "${roleName}" does not exist.`);
    const controller = resources_1.resources("role").find((r) => r.template === "roles");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const enumDeclaration = controllerFile.getEnum("Roles");
    const tmp = enumDeclaration.getMember(pascalcase(roleName));
    for (const referencedSymbol of tmp.findReferences()) {
        for (const reference of referencedSymbol.getReferences()) {
            if (reference.getSourceFile().getFilePath().match("controller")) {
                const args = reference
                    .getNode()
                    .getParentOrThrow()
                    .getParentOrThrow();
                for (const e of args.getElements()) {
                    const tmp = e;
                    if (tmp.getName() === roleName) {
                        args.removeElement(e);
                    }
                }
                const decorator = args
                    .getParentOrThrow()
                    .getParentOrThrow();
                if (decorator.getArguments()[1].getText() === "[]") {
                    decorator.remove();
                }
            }
        }
    }
    if (tmp) {
        const member = tmp.remove();
    }
}
exports.deleteRole = deleteRole;
