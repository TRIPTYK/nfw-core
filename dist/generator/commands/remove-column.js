"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeColumn = void 0;
const camelcase = require("camelcase");
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function removeColumn(modelName, column) {
    const model = resources_1.resources(modelName).find((r) => r.template === "model");
    const modelFile = project_1.default.getSourceFile(`${model.path}/${model.name}`);
    const columnName = typeof column === "string" ? column : column.name;
    const { classPrefixName } = resources_1.getEntityNaming(modelName);
    if (!modelFile) {
        throw new Error("Entity does not exists");
    }
    const entityClass = modelFile.getClass(classPrefixName);
    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }
    const columnProperty = entityClass.getInstanceProperty(columnName);
    if (!columnProperty) {
        throw new Error(`Entity property ${columnProperty} does not exists`);
    }
    const entityInterface = modelFile.getInterface(`${classPrefixName}Interface`);
    if (entityInterface) {
        entityInterface.getProperty(columnName)?.remove();
    }
    columnProperty.remove();
    const importDeclaration = modelFile.getImportDeclaration(`../enums/${camelcase(columnName)}.enum`);
    if (importDeclaration) {
        const enumsFile = project_1.default.getSourceFile(`src/api/enums/${camelcase(columnName)}.enum.ts`);
        importDeclaration.remove();
        enumsFile.delete();
    }
    const serializer = resources_1.resources(modelName).find((r) => r.template === "serializer-schema");
    const serializerFile = project_1.default.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${classPrefixName}SerializerSchema`);
    serializerClass.getInstanceProperty(columnName).remove();
    const validation = resources_1.resources(modelName).find((r) => r.template === "validation");
    const validationFile = project_1.default.getSourceFile(`${validation.path}/${validation.name}`);
    const validations = validationFile
        .getChildrenOfKind(ts_morph_1.SyntaxKind.VariableStatement)
        .filter((declaration) => declaration.hasExportKeyword() &&
        declaration.getDeclarationKind() === ts_morph_1.VariableDeclarationKind.Const);
    for (const validationStatement of validations) {
        const initializer = validationStatement
            .getDeclarations()[0]
            .getFirstChildByKind(ts_morph_1.SyntaxKind.ObjectLiteralExpression);
        if (initializer) {
            const property = initializer.getProperty(columnName);
            if (property) {
                property.remove();
            }
        }
    }
    validationFile.fixUnusedIdentifiers();
}
exports.removeColumn = removeColumn;
