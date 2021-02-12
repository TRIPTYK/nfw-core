"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerializer = void 0;
const pluralize = require("pluralize");
const project_1 = require("../utils/project");
function createSerializer({ modelName, fileTemplateInfo, classPrefixName, filePrefixName, }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true,
    });
    file.addImportDeclaration({
        namedImports: [classPrefixName],
        moduleSpecifier: `../models/${filePrefixName}.model`,
    });
    const serializerClass = file.addClass({
        name: `${classPrefixName}Serializer`,
    });
    serializerClass.setIsExported(true);
    serializerClass.setExtends(`BaseJsonApiSerializer<${classPrefixName}>`);
    serializerClass.addDecorator({
        name: "singleton",
        arguments: [],
    });
    serializerClass.addDecorator({
        name: "JsonApiSerializer",
        arguments: [
            (writer) => {
                writer.block(() => {
                    writer.setIndentationLevel(1);
                    writer.writeLine(`type : "${pluralize(modelName)}",`);
                    writer.writeLine(`schemas : () => [${classPrefixName}SerializerSchema]`);
                });
            },
        ],
    });
    return file;
}
exports.createSerializer = createSerializer;
