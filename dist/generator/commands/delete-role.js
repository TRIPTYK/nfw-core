"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pascalcase = require("pascalcase");
const project_1 = require("../utils/project");
async function deleteRole(roleName) {
    const file = project_1.default.getSourceFileOrThrow("src/api/enums/role.enum.ts");
    const enumDeclaration = file.getEnum("Roles");
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
exports.default = deleteRole;
