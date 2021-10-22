import { EventEmitter } from "events";
import { container, instanceCachingFactory } from "tsyringe";
import { ConnectionManager, useContainer } from "typeorm";
import { v4 } from "uuid";
import { BaseErrorMiddleware, BaseMiddleware } from "..";
import { BaseController } from "../controllers/base.controller";
import { BaseJsonApiModel } from "../models/json-api.model";
import { BaseJsonApiRepository } from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { BaseService } from "../services/base.service";
import { Constructor } from "../types/global";
import { mesure } from "../utils/mesure.util";
import { BaseApplication } from "./base.application";

export enum ApplicationStatus {
  Booting = "BOOTING",
  Running = "RUNNING",
  None = "NONE",
}

export enum ApplicationLifeCycleEvent {
  Boot = "BOOT",
  Running = "RUNNING",
}

export interface RegisterOptions {
  baseRoute: string,
  controllers: Constructor<BaseController>[],
  services: Constructor<BaseService>[],
  middlewares: Constructor<BaseMiddleware | BaseErrorMiddleware>[],
  entities: Constructor<BaseJsonApiModel<unknown>>[],
  serializers: Constructor<BaseJsonApiSerializer<unknown>>[],
  repositories: Constructor<BaseJsonApiRepository<unknown>>[],
}

export class ApplicationRegistry {
  public static application: BaseApplication;
  public static status: ApplicationStatus = ApplicationStatus.None;
  public static guid = v4();
  private static eventEmitter: EventEmitter = new EventEmitter();

  public static on(event: ApplicationLifeCycleEvent, callback) {
    ApplicationRegistry.eventEmitter.on(event, callback);
  }

  public static async registerApplication<T extends BaseApplication>(
    app: Constructor<T>,
    { controllers, services, serializers, baseRoute }: RegisterOptions
  ) {
    ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Boot);
    ApplicationRegistry.status = ApplicationStatus.Booting;
    const startTime = Date.now();

    // services before all
    let time = await mesure(async () => {
      await Promise.all(
        services.map((service: Constructor<BaseService>) => container.resolve(service).init())
      );
    });
    console.log(`[${time}ms] initialized ${services.length} services`);

    const instance = (ApplicationRegistry.application = new app());
    // app constructor
    time = await mesure(async () => {
      await instance.init();
    });
    console.log(`[${time}ms] initialized app instance`);

    // controllers
    time = await mesure(async () => {
      await Promise.all(
        controllers.map((controller: Constructor<BaseController>) => container.resolve(controller).init())
      );
    });
    console.log(`[${time}ms] initialized ${controllers.length} controllers`);

    // serializers
    time = await mesure(async () => {
      for (const serializer of serializers) {
        container.resolve(serializer).init();
      }
    });
    console.log(`[${time}ms] initialized ${serializers.length} serializers`);

    // setup routes etc ...
    time = await mesure(async () => {
      await instance.setupControllers(controllers,baseRoute);
    });
    console.log(`[${time}ms] setup controllers and routing`);

    // afterInit hook
    time = await mesure(async () => {
      await instance.afterInit();
    });

    ApplicationRegistry.status = ApplicationStatus.Running;
    ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Running);

    console.log(`[${time}ms] after init`);

    console.log(
      "Server initialized and ready in",
      Date.now() - startTime,
      "ms"
    );

    return instance;
  }
}
