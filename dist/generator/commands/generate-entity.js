"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJsonApiEntity = void 0;
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const add_column_1 = require("./add-column");
const add_relation_1 = require("./add-relation");
async function generateJsonApiEntity(modelName, data) {
    if (!modelName.length) {
        return;
    }
    const tableColumns = data ?? {
        columns: [],
        relations: [],
    };
    const files = [];
    const { filePrefixName, classPrefixName } = resources_1.getEntityNaming(modelName);
    for (const file of resources_1.resources(filePrefixName)) {
        if (!["base-controller", "roles"].includes(file.template)) {
            const imported = await Promise.resolve().then(() => require(`../templates/${file.template}`));
            const generator = imported[Object.keys(imported)[0]];
            const createdFile = await generator({
                modelName,
                classPrefixName,
                filePrefixName,
                fileTemplateInfo: file,
                tableColumns,
            });
            files.push(createdFile);
        }
    }
    const applicationFile = project_1.default.getSourceFile("src/api/application.ts");
    const applicationClass = applicationFile.getClasses()[0];
    const importControllerName = `${classPrefixName}Controller`;
    const objectArgs = applicationClass
        .getDecorator("RegisterApplication")
        .getArguments()[0];
    const controllersArray = objectArgs
        .getProperty("controllers")
        .getFirstChildByKind(ts_morph_1.SyntaxKind.ArrayLiteralExpression);
    const exists = controllersArray
        .getElements()
        .find((elem) => elem.getText() === importControllerName);
    if (!exists) {
        controllersArray.addElement(importControllerName);
    }
    for (const column of tableColumns.columns) {
        await add_column_1.addColumn(modelName, column);
    }
    for (const relation of tableColumns.relations) {
        await add_relation_1.addRelation(modelName, relation);
    }
    // auto generate imports
    for (const file of files.concat(applicationFile)) {
        file.fixMissingImports();
    }
}
exports.generateJsonApiEntity = generateJsonApiEntity;
