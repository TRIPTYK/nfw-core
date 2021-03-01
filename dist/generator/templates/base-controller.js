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
function createBaseControllerTemplate({ fileTemplateInfo, classPrefixName, filePrefixName }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });
    const controllerClass = file.addClass({
        name: `${classPrefixName}Controller`
    });
    controllerClass.setIsDefaultExport(true);
    controllerClass
        .addDecorator({
        name: "GeneratedController",
        arguments: [`"${classPrefixName.toLowerCase()}"`]
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
    controllerClass.setExtends(`BaseController`);
    return file;
}
exports.default = createBaseControllerTemplate;
