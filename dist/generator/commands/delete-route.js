"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBasicRoute = void 0;
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const get_routes_1 = require("./get-routes");
async function deleteBasicRoute(prefix) {
    if (!prefix.length) {
        return;
    }
    const { filePrefixName, classPrefixName } = resources_1.getEntityNaming(prefix);
    const file = resources_1.resources(filePrefixName).find((f) => f.template === "base-controller");
    const fileObj = project_1.default.getSourceFile(`${file.path}/${file.name}`);
    if (!fileObj) {
        throw new Error(`Entity file ${file.name} does not seems to exists`);
    }
    const currentRoute = (await get_routes_1.getRoutes()).find((route) => route.prefix === prefix);
    if (currentRoute.type !== "generated") {
        throw new Error("Only generated routes can be deleted by DELETE method.");
    }
    fileObj?.delete();
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
exports.deleteBasicRoute = deleteBasicRoute;
