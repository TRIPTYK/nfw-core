import { EventEmitter } from "events";
import { Application, default as createApplication } from "express";
import { container } from "tsyringe";
import { createConnection } from "typeorm";
import { v4 } from "uuid";
import { BaseController } from "../controllers/base.controller";
import { buildApplication } from "../factory/build-application";
import { getMetadataStorage } from "../metadata/metadata-storage";
import { BaseService } from "../services/base.service";
import { Constructor } from "../types/global";
import { mesure } from "../utils/mesure.util";

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
  controllers: Constructor<BaseController>[]
}

export class ApplicationRegistry {
  public static application: Application;
  public static status: ApplicationStatus = ApplicationStatus.None;
  public static guid = v4();
  private static eventEmitter: EventEmitter = new EventEmitter();

  public static on(event: ApplicationLifeCycleEvent, callback) {
    ApplicationRegistry.eventEmitter.on(event, callback);
  }

  public static async registerApplication(
    { controllers, baseRoute }: RegisterOptions
  ) {
    ApplicationRegistry.eventEmitter.emit(ApplicationLifeCycleEvent.Boot);
    ApplicationRegistry.status = ApplicationStatus.Booting;

    await createConnection({
      database: "nfw",
      host: "localhost",
      password: "test123*",
      username: "root",
      type: "mysql",
      entities: ["./src/api/models/*.ts"]
    });

    const startTime = Date.now();
    const services = getMetadataStorage().services.map(s => s.target);

    // services before all
    let time = await mesure(async () => {
      await Promise.all(
        services.map((service: Constructor<BaseService>) => container.resolve(service).init())
      );
    });
    console.log(`[${time}ms] initialized ${services.length} services`);

    const instance = (ApplicationRegistry.application = createApplication());
    
    // controllers
    time = await mesure(async () => {
      await Promise.all(
        controllers.map((controller: Constructor<BaseController>) => container.resolve(controller).init())
      );
    });
    console.log(`[${time}ms] initialized ${controllers.length} controllers`);

    // setup routes etc ...
    time = await mesure(async () => {
      const mainRouter = buildApplication(controllers);
      instance.use(baseRoute, mainRouter);
    });
    console.log(`[${time}ms] setup controllers and routing`);

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
