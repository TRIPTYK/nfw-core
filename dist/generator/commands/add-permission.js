"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function addPerms(route, role) {
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
    const importAuthMiddleware = controllerFile.getImportDeclaration("../middlewares/auth.middleware");
    if (!importAuthMiddleware) {
        const newImport = controllerFile.addImportDeclaration({
            defaultImport: "AuthMiddleware",
            namedImports: ["AuthMiddlewareArgs"],
            moduleSpecifier: "../middlewares/auth.middleware"
        });
    }
    const importRole = controllerFile.getImportDeclaration("../enums/role.enum");
    if (!importRole) {
        const newImport = controllerFile.addImportDeclaration({
            namedImports: ["Roles"],
            moduleSpecifier: "../enums/role.enum"
        });
    }
    const importRouteMiddleware = controllerFile.getImportDeclaration("../../core/decorators/controller.decorator");
    if (!importRouteMiddleware) {
        const newImport = controllerFile.addImportDeclaration({
            namedImports: ["RouteMiddleware"],
            moduleSpecifier: "../../core/decorators/controller.decorator"
        });
    }
    else {
        const namedRouteMiddleware = importRouteMiddleware.getNamedImports();
        const tmp = [];
        namedRouteMiddleware.forEach((element) => {
            tmp.push(element.getName());
        });
        if (!tmp.includes("RouteMiddleware")) {
            importRouteMiddleware.addNamedImport({
                name: "RouteMiddleware"
            });
        }
    }
    const decorators = controllerClass.getDecorator("RouteMiddleware");
    if (!decorators) {
        controllerClass
            .addDecorator({
            name: "RouteMiddleware<AuthMiddlewareArgs>",
            arguments: ["AuthMiddleware", `[Roles.${role}]`]
        })
            .setIsDecoratorFactory(true);
    }
    else {
        const args = decorators.getArguments()[1];
        for (const e of args.getElements()) {
            const tmp = e;
            if (role === tmp.getName()) {
                throw new Error(`${role} already exist`);
            }
        }
        args.addElement(`Roles.${role}`);
    }
}
exports.default = addPerms;
