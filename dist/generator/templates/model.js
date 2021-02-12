"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const project_1 = require("../utils/project");
/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
function createModelTemplate({ fileTemplateInfo, classPrefixName, modelName, filePrefixName }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true
    });
    const interfaceNameForModel = `${classPrefixName}Interface`;
    file.addInterface({
        name: interfaceNameForModel
    }).setIsExported(true);
    file.addImportDeclaration({
        moduleSpecifier: `../validations/${filePrefixName}.validation`,
        defaultImport: `* as ${classPrefixName}Validator`
    });
    const modelClass = file.addClass({
        name: classPrefixName
    });
    modelClass.setExtends(`JsonApiModel<${classPrefixName}>`);
    modelClass.addImplements(interfaceNameForModel);
    modelClass
        .addDecorator({
        name: "JsonApiEntity",
        arguments: [
            `"${pluralize(modelName)}"`,
            (writer) => {
                writer.block(() => {
                    writer.setIndentationLevel(1);
                    writer.writeLine(`serializer: ${classPrefixName}Serializer,`);
                    writer.writeLine(`repository: ${classPrefixName}Repository,`);
                    writer.writeLine(`validator: ${classPrefixName}Validator`);
                });
            }
        ]
    })
        .setIsDecoratorFactory(true);
    modelClass.setIsExported(true);
    return file;
}
exports.default = createModelTemplate;
//# sourceMappingURL=model.js.map