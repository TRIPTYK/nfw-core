import { BaseController } from "../controllers/base.controller";
import { JsonApiModel } from "../models/json-api.model";
import { BaseJsonApiRepository } from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
import { BaseApplication } from "./base.application";
export declare enum ApplicationStatus {
    Booting = "BOOTING",
    Running = "RUNNING",
    None = "NONE"
}
export declare enum ApplicationLifeCycleEvent {
    Boot = "BOOT",
    Running = "RUNNING"
}
export declare class ApplicationRegistry {
    static application: BaseApplication;
    static entities: Constructor<JsonApiModel<any>>[];
    static repositories: {
        [key: string]: Constructor<BaseJsonApiRepository<any>>;
    };
    static serializers: {
        [key: string]: Constructor<BaseJsonApiSerializer<any>>;
    };
    static controllers: BaseController[];
    static status: ApplicationStatus;
    static guid: any;
    private static eventEmitter;
    static on(event: ApplicationLifeCycleEvent, callback: any): void;
    static registerApplication<T extends BaseApplication>(app: Constructor<T>): Promise<T>;
    static registerEntity<T extends JsonApiModel<T>>(entity: Constructor<T>): void;
    static repositoryFor<T extends JsonApiModel<T>>(entity: Constructor<T>): BaseJsonApiRepository<T>;
    static serializerFor<T extends JsonApiModel<T>>(entity: Constructor<T>): BaseJsonApiSerializer<T>;
    static registerController(controller: BaseController): void;
    static registerCustomRepositoryFor<T extends JsonApiModel<T>>(entity: Constructor<T>, repository: Constructor<BaseJsonApiRepository<T>>): void;
    static registerSerializerFor<T extends JsonApiModel<T>>(entity: Constructor<T>, serializer: Constructor<BaseJsonApiSerializer<T>>): void;
}
