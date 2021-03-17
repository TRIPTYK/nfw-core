"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const registry_application_1 = require("../../application/registry.application");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const add_endpoint_1 = require("./add-endpoint");
async function generateBasicRoute(prefix, methods) {
    if (!prefix) {
        return;
    }
    prefix = prefix.toLowerCase();
    for (const route of registry_application_1.ApplicationRegistry.application.Routes) {
        if (prefix === route.prefix.toLowerCase()) {
            throw new Error("This route already exists.");
        }
    }
    methods = methods ?? ["GET"];
    const { filePrefixName, classPrefixName } = resources_1.getEntityNaming(prefix);
    const file = resources_1.resources(filePrefixName).find((f) => f.template === "base-controller");
    const imported = await Promise.resolve().then(() => require(`../templates/${file.template}`));
    const generator = imported[Object.keys(imported)[0]];
    const createdFile = await generator({
        prefix,
        classPrefixName,
        filePrefixName,
        fileTemplateInfo: file
    });
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
    for (const method of methods) {
        await add_endpoint_1.default(prefix, method);
    }
    // auto generate imports
    for (const file of [].concat(applicationFile, createdFile)) {
        file.fixMissingImports();
    }
}
exports.default = generateBasicRoute;
