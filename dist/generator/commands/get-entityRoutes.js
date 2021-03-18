"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const pluralize = require("pluralize");
const pascalcase = require("pascalcase");
async function getEntityRoutes(entity, routes) {
    const entityName = pascalcase(pluralize.singular(entity));
    const controller = resources_1.resources(entityName).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(entityName);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const controllerClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!controllerClass) {
        throw new Error("This class does not exit");
    }
    const routeRoleList = [];
    for (const route of routes) {
        const method = controllerClass.getMethod(route.methodName);
        const array = [];
        if (method) {
            const decorators = method.getDecorator("JsonApiMethodMiddleware");
            if (decorators) {
                const args = decorators.getArguments()[1];
                if (decorators.getArguments()[0].getFullText() === "AuthMiddleware") {
                    if (args) {
                        args.getElements().forEach((e) => {
                            const tmp = e;
                            array.push(tmp.getName());
                        });
                    }
                }
            }
        }
        routeRoleList.push({
            methodName: route.methodName,
            requestMethod: route.requestMethod,
            path: route.path,
            roles: array,
        });
    }
    return routeRoleList;
}
exports.default = getEntityRoutes;
