"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../utils/project");
/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
function createControllerTemplate({ fileTemplateInfo, classPrefixName, filePrefixName }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });
    file.addImportDeclaration({
        namedImports: [classPrefixName],
        moduleSpecifier: `../models/${filePrefixName}.model`
    });
    const controllerClass = file.addClass({
        name: `${classPrefixName}Controller`
    });
    controllerClass.setIsDefaultExport(true);
    controllerClass
        .addDecorator({
        name: "JsonApiController",
        arguments: [`${classPrefixName}`]
    })
        .setIsDecoratorFactory(true);
    controllerClass
        .addDecorator({
        name: "singleton"
    })
        .setIsDecoratorFactory(true);
    controllerClass
        .addDecorator({
        name: "autoInjectable"
    })
        .setIsDecoratorFactory(true);
    controllerClass.setExtends(`BaseJsonApiController<${classPrefixName}>`);
    return file;
}
exports.default = createControllerTemplate;
