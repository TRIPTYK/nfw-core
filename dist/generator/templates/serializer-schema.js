"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerializerSchema = void 0;
const project_1 = require("../utils/project");
function createSerializerSchema({ fileTemplateInfo, classPrefixName, filePrefixName, }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true,
    });
    const addedClass = file.addClass({
        name: `${classPrefixName}SerializerSchema`,
        isExported: true,
    });
    file.addImportDeclaration({
        namedImports: [`${classPrefixName}Interface`],
        moduleSpecifier: `../../models/${filePrefixName}.model`,
    });
    file.addImportDeclaration({
        namedImports: ["Serialize", "Deserialize", "SerializerSchema", "Relation"],
        moduleSpecifier: "@triptyk/nfw-core",
    });
    addedClass.setExtends(`BaseSerializerSchema<${classPrefixName}Interface>`);
    addedClass.addImplements(`${classPrefixName}Interface`);
    addedClass
        .addDecorator({
        name: "SerializerSchema",
        arguments: [],
    })
        .setIsDecoratorFactory(true);
    addedClass
        .addProperty({
        name: "updated_at",
    })
        .toggleModifier("public")
        .addDecorator({
        name: "Serialize",
    })
        .setIsDecoratorFactory(true);
    addedClass
        .addProperty({
        name: "created_at",
    })
        .toggleModifier("public")
        .addDecorator({
        name: "Serialize",
    })
        .setIsDecoratorFactory(true);
    return file;
}
exports.createSerializerSchema = createSerializerSchema;
