"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorController = void 0;
const HttpStatus = require("http-status");
const SocketIO = require("socket.io-client");
const registry_application_1 = require("../../application/registry.application");
const controller_decorator_1 = require("../../decorators/controller.decorator");
const add_column_1 = require("../../generator/commands/add-column");
const add_relation_1 = require("../../generator/commands/add-relation");
const add_endpoint_1 = require("../../generator/commands/add-endpoint");
const add_permission_1 = require("../../generator/commands/add-permission");
const delete_entity_1 = require("../../generator/commands/delete-entity");
const add_role_1 = require("../../generator/commands/add-role");
const delete_role_1 = require("../../generator/commands/delete-role");
const delete_route_1 = require("../../generator/commands/delete-route");
const generate_entity_1 = require("../../generator/commands/generate-entity");
const generate_route_1 = require("../../generator/commands/generate-route");
const remove_column_1 = require("../../generator/commands/remove-column");
const remove_endpoint_1 = require("../../generator/commands/remove-endpoint");
const remove_permissions_1 = require("../../generator/commands/remove-permissions");
const remove_relation_1 = require("../../generator/commands/remove-relation");
const project_1 = require("../../generator/utils/project");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const generator_validation_1 = require("../../validation/generator.validation");
const base_controller_1 = require("../base.controller");
/**
 * Generates app
 */
let GeneratorController = class GeneratorController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.socket = null;
        this.socket = SocketIO("http://localhost:3000", {
            query: {
                app: false,
            },
        });
        registry_application_1.ApplicationRegistry.on(registry_application_1.ApplicationLifeCycleEvent.Running, () => {
            this.socket.on("connect", () => {
                this.socket.emit("hello");
            });
            // removeRelation("user", "documents").then(() => project.save());
        });
    }
    async generateRoute(req, res) {
        await generate_route_1.default(req.params.name, req.body.methods);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async generateSubRoute(req, res) {
        await add_endpoint_1.default(req.params.name, req.body.method, req.body.subRoute);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async generateEntity(req, res) {
        await generate_entity_1.generateJsonApiEntity(req.params.name, {
            columns: req.body.columns,
            relations: req.body.relations,
        });
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async addPermissions(req, res) {
        for (const element of req.body.elements) {
            if (element.type === "ADD") {
                await add_permission_1.default(element);
            }
            if (element.type === "REMOVE") {
                await remove_permissions_1.default(element);
            }
            if (element.type === "CREATE") {
                await add_role_1.default(element.role);
            }
            if (element.type === "DELETE") {
                await delete_role_1.default(element.role);
            }
        }
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async addEntityRelation(req, res) {
        await add_relation_1.addRelation(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async generateColumn(req, res) {
        await add_column_1.addColumn(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async do(req, res) {
        for (const column of req.body.columns) {
            if (column.action === "ADD") {
                await add_column_1.addColumn(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await remove_column_1.removeColumn(req.params.name, column);
            }
        }
        for (const column of req.body.relations) {
            if (column.action === "ADD") {
                await add_relation_1.addRelation(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await remove_relation_1.removeRelation(req.params.name, column);
            }
        }
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async deleteRoute(req, res) {
        await delete_route_1.default(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async deleteSubRoute(req, res) {
        await remove_endpoint_1.default(req.params.name, req.params.methodName);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async deleteEntityColumn(req, res) {
        await remove_column_1.removeColumn(req.params.name, req.params.column);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async deleteEntityRelation(req, res) {
        await remove_relation_1.removeRelation(req.params.name, req.params.relation);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async deleteEntity(req, res) {
        await delete_entity_1.deleteJsonApiEntity(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    async modSubRoute(req, res) {
        await remove_endpoint_1.default(req.params.name, req.params.methodName);
        await add_endpoint_1.default(req.params.name, req.body.method, req.body.subRoute);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.afterProcedure();
    }
    sendMessageAndWaitResponse(type, data) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                console.log(`[${type}]:\t${response}`);
                if (response === "ok") {
                    resolve(response);
                }
                else {
                    rej(response);
                }
            });
        });
    }
    async afterProcedure() {
        try {
            await project_1.default.save();
            await this.sendMessageAndWaitResponse("app-recompile-sync");
            await this.sendMessageAndWaitResponse("app-restart");
            await this.sendMessageAndWaitResponse("app-save");
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    controller_decorator_1.Post("/route/:name"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createRoute,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateRoute", null);
__decorate([
    controller_decorator_1.Post("/route/:name/subroute"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createSubRoute,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateSubRoute", null);
__decorate([
    controller_decorator_1.Post("/entity/:name"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createEntity,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateEntity", null);
__decorate([
    controller_decorator_1.Post("/perms/:name"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.addPermissions,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "addPermissions", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/relation"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createRelation,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "addEntityRelation", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/column"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createColumn,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateColumn", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/entity-actions"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.columnsActions,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "do", null);
__decorate([
    controller_decorator_1.Delete("/route/:name"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteRoute", null);
__decorate([
    controller_decorator_1.Delete("/route/:name/subroute/:methodName"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteSubRoute", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name/:column"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntityColumn", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name/relation/:relation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntityRelation", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntity", null);
__decorate([
    controller_decorator_1.Patch("/route/:name/subroute/:methodName"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createSubRoute,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "modSubRoute", null);
GeneratorController = __decorate([
    controller_decorator_1.Controller("generate"),
    __metadata("design:paramtypes", [])
], GeneratorController);
exports.GeneratorController = GeneratorController;
