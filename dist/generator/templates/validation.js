"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationTemplate = void 0;
const project_1 = require("../utils/project");
const ts_morph_1 = require("ts-morph");
const stringify_object_1 = require("stringify-object");
function createValidationTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }) {
    const file = project_1.default.createSourceFile(`${fileTemplateInfo.path}/${fileTemplateInfo.name}`, null, {
        overwrite: true,
    });
    file.addStatements((writer) => writer.writeLine('import * as Joi from "joi";'));
    file.addStatements((writer) => writer.writeLine('import Boom from "@hapi/boom";'));
    file.addStatements((writer) => writer.writeLine('import * as Moment from "moment-timezone";'));
    file.addStatements((writer) => writer.writeLine('import { ValidationSchema } from "@triptyk/nfw-core";'));
    file.addStatements((writer) => writer.writeLine(`import { ${classPrefixName} } from "../models/${filePrefixName}.model";`));
    let variableStatement = file.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "get",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: stringify_object_1.default({
                    id: {
                        in: ["params"],
                        errorMessage: "Please provide a valid id",
                        isInt: true,
                        toInt: true,
                    },
                }, { singleQuotes: false }),
            },
        ],
    });
    variableStatement.setIsExported(true);
    variableStatement = file.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "list",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}",
            },
        ],
    });
    variableStatement.setIsExported(true);
    variableStatement = file.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "create",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}",
            },
        ],
    });
    variableStatement.setIsExported(true);
    variableStatement = file.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "update",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: (writer) => {
                    writer.block(() => {
                        writer.writeLine("...exports.get,");
                        writer.write("...{}");
                    });
                },
            },
        ],
    });
    variableStatement.setIsExported(true);
    variableStatement = file.addVariableStatement({
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        declarations: [
            {
                name: "remove",
                type: `ValidationSchema<${classPrefixName}>`,
                initializer: "{}",
            },
        ],
    });
    variableStatement.setIsExported(true);
    return file;
}
exports.createValidationTemplate = createValidationTemplate;
