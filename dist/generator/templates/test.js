"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../utils/project");
function createTestTemplate({ fileTemplateInfo }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });
    file.addImportDeclaration({ moduleSpecifier: "chai" }).addNamedImport("expect");
    file.addImportDeclaration({
        moduleSpecifier: "supertest",
        namespaceImport: "supertest"
    });
    return file;
}
exports.default = createTestTemplate;
//# sourceMappingURL=test.js.map