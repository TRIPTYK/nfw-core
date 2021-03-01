"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function getPerms(entity) {
    const controller = resources_1.resources(entity).find((r) => r.template === "controller");
    const controllerFile = project_1.default.getSourceFile(`${controller.path}/${controller.name}`);
    const { classPrefixName } = resources_1.getEntityNaming(entity);
    if (!controllerFile) {
        throw new Error("This controller does not exist.");
    }
    const controllerClass = controllerFile.getClass(`${classPrefixName}Controller`);
    if (!controllerClass) {
        throw new Error("This class does not exit");
    }
    const array = [];
    const decorators = controllerClass.getDecorator("RouteMiddleware");
    if (decorators) {
        const args = decorators.getArguments()[1];
        args.getElements().forEach((e) => {
            const tmp = e;
            array.push(tmp.getName());
        });
    }
    return array;
}
exports.default = getPerms;
