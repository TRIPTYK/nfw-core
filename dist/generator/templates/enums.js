"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("camelcase");
const pascalcase = require("pascalcase");
const project_1 = require("../utils/project");
function createEnumsTemplate(name, enums) {
    const file = project_1.default.createSourceFile(`src/api/enums/${camelcase(name)}.enum.ts`, null, {
        overwrite: true
    });
    const enumDeclaration = file.addEnum({
        name: pascalcase(name)
    });
    enumDeclaration.setIsExported(true);
    enums.forEach((element) => {
        const member = enumDeclaration.addMember({
            name: pascalcase(element),
            value: element
        });
    });
}
exports.default = createEnumsTemplate;
