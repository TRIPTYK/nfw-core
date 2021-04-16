"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const project_1 = require("../utils/project");
const pluralize = require("pluralize");
async function getRoutes() {
    const validDecorator = ["Get", "Post", "Patch", "Delete"];
    const controllerFiles = project_1.default.getSourceFiles("src/api/controllers/*.controller.ts");
    const entity = [];
    for (const controller of controllerFiles) {
        const classes = controller.getClasses();
        for (const classe of classes) {
            let prefix = classe.getName().replace("Controller", "").toLowerCase();
            const classDecorators = classe.getDecorators();
            const arrayNameDecorator = [];
            for (const classDecorator of classDecorators) {
                arrayNameDecorator.push(classDecorator.getName());
            }
            let type;
            if (arrayNameDecorator.includes("JsonApiController")) {
                type = "entity";
                prefix = pluralize(prefix);
            }
            else if (arrayNameDecorator.includes("GeneratedController")) {
                type = "generated";
            }
            else {
                type = "basic";
            }
            const routes = [];
            const methods = classe.getMethods();
            for (const method of methods) {
                const decorators = method.getDecorators();
                for (const decorator of decorators) {
                    if (validDecorator.includes(decorator.getName())) {
                        const args = decorator.getArguments();
                        for (const arg of args) {
                            routes.push({
                                path: arg.getFullText(),
                                requestMethod: decorator.getName().toLowerCase(),
                                methodName: method.getName(),
                            });
                        }
                    }
                }
            }
            entity.push({ prefix, type, routes });
        }
    }
    return entity;
}
exports.getRoutes = getRoutes;
