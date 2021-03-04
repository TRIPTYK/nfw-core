"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
const pascalcase = require("pascalcase");
async function addPerms(element) {
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
            if (!decorators) {
                controllerMethod
                    .addDecorator({
                    name: "JsonApiMethodMiddleware<AuthMiddlewareArgs>",
                    arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
                })
                    .setIsDecoratorFactory(true);
            }
            else {
                const args = decorators.getArguments()[1];
                for (const e of args.getElements()) {
                    const tmp = e;
                    if (element.role === tmp.getName()) {
                        throw new Error(`${element.role} already exist`);
                    }
                }
                args.addElement(`Roles.${element.role}`);
            }
        }
        else {
            const controllerMethod = controllerClass.addMethod({
                name: element.methodName,
                returnType: "any",
                scope: ts_morph_1.Scope.Public,
                parameters: [{ name: "req", type: "Request" }, { name: "res" }],
            });
            controllerMethod
                .addDecorator({
                name: pascalcase(element.requestMethod),
                arguments: [`"${element.path}"`],
            })
                .setIsDecoratorFactory(true);
            controllerMethod
                .addDecorator({
                name: "JsonApiMethodMiddleware<AuthMiddlewareArgs>",
                arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
            })
                .setIsDecoratorFactory(true);
            controllerMethod.setBodyText((writer) => writer.writeLine(`return super.${element.methodName}(req, res);`));
        }
    }
    else {
        const decorators = controllerClass.getDecorator("RouteMiddleware");
        if (!decorators) {
            controllerClass
                .addDecorator({
                name: "RouteMiddleware<AuthMiddlewareArgs>",
                arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
            })
                .setIsDecoratorFactory(true);
        }
        else {
            const args = decorators.getArguments()[1];
            for (const e of args.getElements()) {
                const tmp = e;
                if (element.role === tmp.getName()) {
                    throw new Error(`${element.role} already exist`);
                }
            }
            args.addElement(`Roles.${element.role}`);
        }
    }
    controllerFile.fixMissingImports();
}
exports.default = addPerms;
