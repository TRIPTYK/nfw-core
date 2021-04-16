"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const project_1 = require("../utils/project");
const pluralize = require("pluralize");
const routes_1 = require("../../enums/routes");
async function getRoutes() {
    const regController = /Controller/gm;
    const regQuotes = /"/gm;
    const typeByController = {
        JsonApiController: "entity",
        GeneratedController: "generated",
        Controller: "basic"
    };
    const controllerFiles = [
        ...project_1.default.getSourceFiles("src/api/controllers/*.controller.ts"),
        ...project_1.default.getSourceFiles("node_modules/@triptyk/nfw-core/src/controllers/prefab/*.controller.ts")
    ];
    const entity = [];
    for (const controller of controllerFiles) {
        const controllerClass = controller.getClasses()
            .find(c => c.getName().match(regController));
        const controllerDecorator = controllerClass.getDecorators()
            .find(c => c.getName().match(regController));
        if (controllerClass) {
            let prefix = controllerDecorator.getArguments()[0]
                .getText().toLowerCase().replace(regQuotes, '');
            const type = typeByController[controllerDecorator.getName()];
            prefix = (type === "entity") ? pluralize(prefix) : prefix;
            let routes = [
                ...controllerClass.getMethods(),
                ...controllerClass.getBaseClass().getMethods()
            ]
                .filter(m => m.getDecorators().length > 0)
                .map(m => {
                const deco = m.getDecorators()[0];
                const arg = deco.getArguments()[0];
                if (routes_1.validDecorators.includes(deco.getName())) {
                    return {
                        path: (arg) ? arg.getText().replace(regQuotes, '') : `/${m.getName()}`,
                        requestMethod: deco.getName().toLowerCase(),
                        methodName: m.getName()
                    };
                }
            })
                .filter(route => route);
            if (type === "entity") {
                routes = [
                    ...routes,
                    ...routes_1.jsonApiRoutes.map(route => {
                        return {
                            path: route.path,
                            requestMethod: route.methodType,
                            methodName: route.method
                        };
                    })
                ];
            }
            entity.push({ prefix, type, routes });
        }
    }
    return entity;
}
exports.getRoutes = getRoutes;
