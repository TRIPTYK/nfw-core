"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const application_1 = require("../../application");
const case_util_1 = require("../../utils/case.util");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const naming_1 = require("../utils/naming");
async function addEndpoint(prefix, method, subroute) {
    if (application_1.ApplicationRegistry.application.Routes.find((r) => r.prefix === prefix)
        ?.type === "basic") {
        throw new Error("Subroute can't be added to basic routes.");
    }
    subroute = `/${path_1.normalize(subroute ?? "/").replace(/^\/+|\/+$/, "")}`;
    prefix = naming_1.getJsonApiEntityName(prefix)?.entityName.toLowerCase() ?? prefix;
    const methodName = case_util_1.toCamelCase(`${method} ${prefix} ${subroute.replace("/", " ")}`);
    const controller = resources_1.resources(prefix).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(prefix);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    if (!controllerFile.getImportDeclaration("express")) {
        controllerFile.addImportDeclaration({
            defaultImport: "Express",
            moduleSpecifier: "express"
        });
    }
    const routeClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!routeClass) {
        throw new Error("This class does not exit.");
    }
    if (routeClass.getMethod(methodName)) {
        throw new Error("This method already exists.");
    }
    routeClass.addMethod({
        name: methodName,
        parameters: [
            {
                name: "req",
                type: "Express.Request"
            },
            {
                name: "res",
                type: "Express.Response"
            }
        ]
    });
    const classMethod = routeClass.getMethod(methodName);
    classMethod.setBodyText(
    // eslint-disable-next-line no-template-curly-in-string
    "res.send(`${req.method} works on ${req.baseUrl + req.url} !!!`);");
    classMethod
        .addDecorator({
        name: method.charAt(0).toUpperCase() + method.toLowerCase().slice(1),
        arguments: [`"${subroute}"`]
    })
        .setIsDecoratorFactory(true);
    controllerFile.fixMissingImports();
}
exports.default = addEndpoint;
