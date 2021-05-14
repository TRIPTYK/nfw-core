"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePerms = void 0;
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function removePerms(element) {
    const controller = resources_1.resources(element.entity).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(element.entity);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const controllerClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!controllerClass) {
        throw new Error("This class does not exit");
    }
    if (element.methodName) {
        const controllerMethod = controllerClass.getMethod(element.methodName);
        if (controllerMethod) {
            const decorators = controllerMethod.getDecorator("JsonApiMethodMiddleware");
            const args = decorators.getArguments()[1];
            for (const e of args.getElements()) {
                const tmp = e;
                if (tmp.getName() === element.role) {
                    args.removeElement(e);
                }
            }
            if (decorators.getArguments()[1].getText() === "[]") {
                decorators.remove();
            }
        }
    }
    else {
        const decorators = controllerClass.getDecorator("RouteMiddleware");
        const args = decorators.getArguments()[1];
        for (const e of args.getElements()) {
            const tmp = e;
            if (tmp.getName() === element.role) {
                args.removeElement(e);
            }
        }
        if (decorators.getArguments()[1].getText() === "[]") {
            decorators.remove();
        }
    }
    controllerFile.fixUnusedIdentifiers();
}
exports.removePerms = removePerms;
