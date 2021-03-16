"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumn = void 0;
const camelcase = require("camelcase");
const pascalcase = require("pascalcase");
const stringifyObject = require("stringify-object");
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const enums_1 = require("../templates/enums");
const project_1 = require("../utils/project");
const template_1 = require("../utils/template");
const types_1 = require("../../enums/types");
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
        if (column.type === "enum") {
            entityInterface.addProperty({
                name: column.name,
                type: pascalcase(column.name),
            });
        }
        else if (column.type === "set") {
            entityInterface.addProperty({
                name: column.name,
                type: `${pascalcase(column.name)}[]`,
            });
        }
        else if (types_1.arrayOfNumber.includes(column.type)) {
            entityInterface.addProperty({
                name: column.name,
                type: "number",
            });
        }
        else if (types_1.arrayOfString.includes(column.type)) {
            entityInterface.addProperty({ name: column.name, type: "string" });
        }
        else if (types_1.arrayOfDate.includes(column.type)) {
            entityInterface.addProperty({ name: column.name, type: "Date" });
        }
        else {
            entityInterface.addProperty({ name: column.name });
        }
    }
    entityClass
        .addProperty({ name: column.name })
        .toggleModifier("public")
        .addDecorator({
        name: "Column",
        arguments: stringifyObject(template_1.buildModelColumnArgumentsFromObject(column), {
            transform: (tmp, prop, originalResult) => {
                if (prop === "default" && tmp.type === "enum") {
                    const val = `${tmp.enum}.${pascalcase(tmp.default)}`;
                    return val;
                }
                if (prop === "default" && tmp.type === "set") {
                    let array = [];
                    for (const value of tmp.default) {
                        array.push(`${tmp.enum}.${pascalcase(value)}`);
                    }
                    return `[${array}]`;
                }
                if (prop === "enum") {
                    return originalResult.split("'").join("");
                }
                return originalResult;
            },
            singleQuote: false,
        }),
    })
        .setIsDecoratorFactory(true);
    if (column.type === "enum") {
        entityClass.getProperty(column.name).setType(pascalcase(column.name));
    }
    else if (column.type === "set") {
        entityClass
            .getProperty(column.name)
            .setType(`${pascalcase(column.name)}[]`);
    }
    else if (types_1.arrayOfNumber.includes(column.type)) {
        entityClass.getProperty(column.name).setType("number");
    }
    else if (types_1.arrayOfString.includes(column.type)) {
        entityClass.getProperty(column.name).setType("string");
    }
    else if (types_1.arrayOfDate.includes(column.type)) {
        entityClass.getProperty(column.name).setType("Date");
    }
    if (column.enums) {
        const importDeclaration = modelFile.addImportDeclaration({
            moduleSpecifier: `../enums/${camelcase(column.name)}.enum`,
            namedImports: pascalcase(column.name),
        });
        enums_1.createEnumsTemplate(column.name, column.enums);
    }
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
        if (column.type === "set") {
            const property = initializer.addPropertyAssignment({
                name: column.name,
                initializer: "",
            });
            property.setInitializer((writer) => writer.block(() => {
                writer.writeLine("exists: true,");
                writer.writeLine("custom: ").block(() => {
                    writer.writeLine("options: (values) =>").block(() => {
                        writer.writeLine("for (const value of values)").block(() => {
                            writer
                                .writeLine(`if (!Object.values(${pascalcase(column.name)}).includes(value))`)
                                .block(() => {
                                writer.writeLine("return false;");
                            });
                        });
                        writer.writeLine("return true;");
                    });
                });
            }));
        }
        else {
            initializer.addPropertyAssignment({
                name: column.name,
                initializer: stringifyObject(template_1.buildValidationArgumentsFromObject(column), {
                    transform: (tmp, prop, originalResult) => {
                        if (prop === "options") {
                            return originalResult.split('"').join("");
                        }
                        return originalResult;
                    },
                    singleQuotes: false,
                }),
            });
        }
    }
    modelFile.fixMissingImports();
    validationFile.fixMissingImports();
}
exports.addColumn = addColumn;
