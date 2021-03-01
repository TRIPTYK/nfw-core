"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function removePerms(route, role) {
    const controller = resources_1.resources(route).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(route);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const controllerClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!controllerClass) {
        throw new Error("This class does not exit");
    }
    const decorators = controllerClass.getDecorator("RouteMiddleware");
    const args = decorators.getArguments()[1];
    for (const e of args.getElements()) {
        const tmp = e;
        if (tmp.getName() === role) {
            args.removeElement(e);
        }
    }
    if (decorators.getArguments()[1].getText() === "[]") {
        decorators.remove();
    }
}
exports.default = removePerms;
