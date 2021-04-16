"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEndpoint = void 0;
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const naming_1 = require("../utils/naming");
const get_routes_1 = require("./get-routes");
/**
 * Delete an endpoint of a specific route.
 * @param prefix Prefix of the route.
 * @param methodName Method (GET, POST, etc).
 */
async function deleteEndpoint(prefix, methodName) {
    const currentRoute = (await get_routes_1.getRoutes()).find(r => r.prefix === prefix);
    prefix = naming_1.getJsonApiEntityName(prefix)?.entityName.toLowerCase() ?? prefix;
    if (currentRoute?.type === "basic") {
        throw new Error("Subroute of basic routes can't be deleted.");
    }
    const subRoute = currentRoute.routes.find((sub) => sub.methodName === methodName);
    if (!currentRoute) {
        throw new Error(`"${prefix}" does not exist.`);
    }
    if (!subRoute) {
        throw new Error(`"${methodName}" does not exist.`);
    }
    const controller = resources_1.resources(prefix).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(prefix);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const routeClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!routeClass) {
        throw new Error("This class does not exit");
    }
    const classMethod = routeClass.getMethod(subRoute.methodName);
    classMethod.getDecorator(subRoute.methodName.charAt(0).toUpperCase() + subRoute.methodName.slice(1));
    classMethod.remove();
    controllerFile.fixMissingImports();
}
exports.deleteEndpoint = deleteEndpoint;
