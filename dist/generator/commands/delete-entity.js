"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function deleteJsonApiEntity(modelName) {
    if (!modelName.length) {
        return;
    }
    const files = [];
    const { filePrefixName, classPrefixName } = resources_1.getEntityNaming(modelName);
    for (const file of resources_1.default(filePrefixName)) {
        const fileObj = project_1.default.getSourceFile(`${file.path}/${file.name}`);
        if (!fileObj) {
            throw new Error(`Entity file ${file.name} does not seems to exists`);
        }
        files.push(fileObj);
    }
    // do something
    for (const file of files) {
        file === null || file === void 0 ? void 0 : file.delete();
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
    controllersArray.removeElement(exists);
    applicationFile.fixUnusedIdentifiers();
}
exports.default = deleteJsonApiEntity;
