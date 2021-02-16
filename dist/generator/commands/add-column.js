"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumn = void 0;
const stringifyObject = require("stringify-object");
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const template_1 = require("../utils/template");
async function addColumn(entity, column) {
    const model = resources_1.resources(entity).find((r) => r.template === "model");
    const modelFile = project_1.default.getSourceFile(`${model.path}/${model.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(entity);
    if (!modelFile) {
        throw new Error("Entity does not exists");
    }
    const entityClass = modelFile.getClass(classPrefixName);
    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }
    if (entityClass.getInstanceProperty(column.name)) {
        throw new Error("Class property already exists");
    }
    const entityInterface = modelFile.getInterface(`${classPrefixName}Interface`);
    if (entityInterface) {
        entityInterface.addProperty({ name: column.name });
    }
    entityClass
        .addProperty({ name: column.name })
        .toggleModifier("public")
        .addDecorator({
        name: "Column",
        arguments: stringifyObject(template_1.buildModelColumnArgumentsFromObject(column), {
            singleQuotes: false,
        }),
    })
        .setIsDecoratorFactory(true);
    const serializer = resources_1.resources(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project_1.default.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${classPrefixName}SerializerSchema`);
    const serializeProperty = serializerClass
        .addProperty({
        name: column.name,
    })
        .toggleModifier("public");
    serializeProperty
        .addDecorator({
        name: "Serialize",
    })
        .setIsDecoratorFactory(true);
    serializeProperty
        .addDecorator({
        name: "Deserialize",
    })
        .setIsDecoratorFactory(true);
    const validation = resources_1.resources(entity).find((r) => r.template === "validation");
    const validationFile = project_1.default.getSourceFile(`${validation.path}/${validation.name}`);
    const validations = validationFile
        .getChildrenOfKind(ts_morph_1.SyntaxKind.VariableStatement)
        .filter((declaration) => declaration.hasExportKeyword() &&
        declaration.getDeclarationKind() === ts_morph_1.VariableDeclarationKind.Const)
        .filter((declaration) => ["create", "update"].includes(declaration.getDeclarations()[0].getName()));
    for (const validationStatement of validations) {
        const initializer = validationStatement
            .getDeclarations()[0]
            .getInitializer();
        initializer.addPropertyAssignment({
            name: column.name,
            initializer: stringifyObject(template_1.buildValidationArgumentsFromObject(column), {
                singleQuotes: false,
            }),
        });
    }
    modelFile.fixMissingImports();
}
exports.addColumn = addColumn;
