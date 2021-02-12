"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestTemplate = void 0;
const project_1 = require("../utils/project");
function createTestTemplate({ fileTemplateInfo }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true,
    });
    file
        .addImportDeclaration({ moduleSpecifier: "chai" })
        .addNamedImport("expect");
    file.addImportDeclaration({
        moduleSpecifier: "supertest",
        namespaceImport: "supertest",
    });
    return file;
}
exports.createTestTemplate = createTestTemplate;
