"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRegistry = exports.ApplicationLifeCycleEvent = exports.ApplicationStatus = void 0;
/* eslint-disable no-console */
const events_1 = require("events");
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const mesure_util_1 = require("../utils/mesure.util");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["Booting"] = "BOOTING";
    ApplicationStatus["Running"] = "RUNNING";
    ApplicationStatus["None"] = "NONE";
})(ApplicationStatus = exports.ApplicationStatus || (exports.ApplicationStatus = {}));
var ApplicationLifeCycleEvent;
(function (ApplicationLifeCycleEvent) {
    ApplicationLifeCycleEvent["Boot"] = "BOOT";
    ApplicationLifeCycleEvent["Running"] = "RUNNING";
})(ApplicationLifeCycleEvent = exports.ApplicationLifeCycleEvent || (exports.ApplicationLifeCycleEvent = {}));
class ApplicationRegistry {
    static on(event, callback) {
        ApplicationRegistry.eventEmitter.on(event, callback);
    }
    static async registerApplication(app) {
        var _a;
        ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Boot);
        ApplicationRegistry.status = ApplicationStatus.Booting;
        const services = Reflect.getMetadata("services", app);
        const controllers = Reflect.getMetadata("controllers", app);
        const middlewares = (_a = Reflect.getMetadata("middlewares", app)) !== null && _a !== void 0 ? _a : [];
        const startTime = Date.now();
        // services before all
        let time = await mesure_util_1.mesure(async () => {
            await Promise.all(services.map((service) => tsyringe_1.container.resolve(service).init()));
        });
        console.log(`[${time}ms] initialized ${services.length} services`);
        const instance = (ApplicationRegistry.application = new app());
        // app constructor
        time = await mesure_util_1.mesure(async () => {
            await instance.init();
        });
        console.log(`[${time}ms] initialized app instance`);
        // controllers
        time = await mesure_util_1.mesure(async () => {
            await Promise.all(controllers.map((controller) => tsyringe_1.container.resolve(controller).init()));
        });
        console.log(`[${time}ms] initialized ${controllers.length} controllers`);
        // serializers
        const serializers = Object.values(ApplicationRegistry.serializers);
        time = await mesure_util_1.mesure(async () => {
            for (const serializer of serializers) {
                tsyringe_1.container.resolve(serializer).init();
            }
        });
        console.log(`[${time}ms] initialized ${serializers.length} serializers`);
        // setup global middlewares
        time = await mesure_util_1.mesure(async () => {
            await instance.setupMiddlewares(middlewares.filter(({ order }) => order === "before"));
        });
        console.log(`[${time}ms] initialized ${middlewares.length} "before" global middlewares`);
        // setup routes etc ...
        time = await mesure_util_1.mesure(async () => {
            await instance.setupControllers(controllers);
        });
        console.log(`[${time}ms] setup controllers and routing`);
        // setup global middlewares
        time = await mesure_util_1.mesure(async () => {
            await instance.setupMiddlewares(middlewares.filter(({ order }) => order === "after"));
        });
        console.log(`[${time}ms] initialized ${middlewares.length} "after" global middlewares`);
        // afterInit hook
        time = await mesure_util_1.mesure(async () => {
            await instance.afterInit();
        });
        ApplicationRegistry.status = ApplicationStatus.Running;
        ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Running);
        console.log(`[${time}ms] after init`);
        console.log("Server initialized and ready in", Date.now() - startTime, "ms");
        return instance;
    }
    static registerEntity(entity) {
        ApplicationRegistry.entities.push(entity);
    }
    static repositoryFor(entity) {
        return typeorm_1.getCustomRepository(ApplicationRegistry.repositories[entity.name]);
    }
    static serializerFor(entity) {
        return tsyringe_1.container.resolve(ApplicationRegistry.serializers[entity.name]);
    }
    static registerController(controller) {
        ApplicationRegistry.controllers.push(controller);
    }
    static registerCustomRepositoryFor(entity, repository) {
        ApplicationRegistry.repositories[entity.name] = repository;
    }
    static registerSerializerFor(entity, serializer) {
        ApplicationRegistry.serializers[entity.name] = serializer;
    }
}
exports.ApplicationRegistry = ApplicationRegistry;
ApplicationRegistry.entities = [];
ApplicationRegistry.repositories = {};
ApplicationRegistry.serializers = {};
ApplicationRegistry.controllers = [];
ApplicationRegistry.status = ApplicationStatus.None;
ApplicationRegistry.guid = uuid_1.v4();
ApplicationRegistry.eventEmitter = new events_1.EventEmitter();
