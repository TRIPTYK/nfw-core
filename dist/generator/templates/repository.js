"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepositoryTemplate = void 0;
const project_1 = require("../utils/project");
function createRepositoryTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true,
    });
    file.addImportDeclaration({
        namedImports: [classPrefixName],
        moduleSpecifier: `../models/${filePrefixName}.model`,
    });
    const repoClass = file.addClass({
        name: `${classPrefixName}Repository`,
    });
    repoClass.setIsExported(true);
    repoClass.setExtends(`BaseJsonApiRepository<${classPrefixName}>`);
    repoClass
        .addConstructor({
        statements: "super();",
    })
        .toggleModifier("public");
    return file;
}
exports.createRepositoryTemplate = createRepositoryTemplate;
