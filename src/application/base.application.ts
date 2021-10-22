/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable complexity */
import kebabCase from "@queso/kebab-case";
import * as Express from "express";
import { container } from "tsyringe";
import { BaseController } from "../controllers/base.controller";
import { ApplicationInterface } from "../interfaces/application.interface";
import {
  GlobalRouteDefinition,
  RouteContext,
} from "../interfaces/routes.interface";
import { getMetadataStorage } from "../metadata/metadata-storage";
import { BaseErrorMiddleware } from "../middlewares/base.error-middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { Constructor } from "../types/global";

export abstract class BaseApplication implements ApplicationInterface {
  protected app: Express.Application;
  protected router: Express.Router;
  protected routes: GlobalRouteDefinition[];

  public constructor() {
    this.app = Express();
    this.router = Express.Router();
    this.routes = [];
  }

  public abstract afterInit(): Promise<any>;

  public async init(): Promise<any> {
    // eslint-disable-next-line no-useless-return
    return;
  }

  public get App() {
    return this.app;
  }

  public get Routes() {
    return this.routes;
  }

  public listen(port: number) {
    return new Promise((resolve) => {
      const server = this.app.listen(port, () => {
        resolve(server);
      });
    });
  }

  /**
   * Setup controllers routing
   */
  public async setupControllers(controllers: Constructor<BaseController>[]) {
    const globalMiddlewares = getMetadataStorage()
      .middlewares.filter((e) => e.level === "application")
      .sort((a, b) => b.priority - a.priority);

    if (globalMiddlewares.length) {
      this.router.use(
        globalMiddlewares.map((e) => this.useMiddleware(e.middleware, e.args))
      );
    }

    for (const controller of controllers) {
      const routerForController = Express.Router();
      const instanceController = container.resolve(controller);
      const controllerMetadata = getMetadataStorage().controllers.find(
        (e) => e.target === controller
      );
      const controllerMiddlewares = getMetadataStorage()
        .middlewares.filter(
          (e) => e.target === controller.constructor && e.level === "controller"
        )
        .sort((a, b) => b.priority - a.priority);
      const routesMetadata = getMetadataStorage().controllerRoutes.filter(
        (e) => {
          return e.target.constructor === Object.getPrototypeOf(controller);
        }
      );

      if (controllerMiddlewares.length) {
        routerForController.use(
          controllerMiddlewares.map((e) => this.useMiddleware(e.middleware, e.args))
        );
      }

      if (controllerMetadata.type === "json-api") {
        const entityMetadata = getMetadataStorage().entities.find(
          (entity) => entity.target === controllerMetadata.entity
        );

        for (const route of routesMetadata) {
          const middlewaresMetaForRoute = getMetadataStorage()
            .middlewares.filter(
              (e) =>
                e.target.constructor === Object.getPrototypeOf(controller) &&
                e.level === "route"
            )
            .sort((a, b) => b.priority - a.priority);

            routerForController[route.method](
              route.path,
              middlewaresMetaForRoute.map((m) => this.useMiddleware(m.middleware,m.args)).concat(
                [instanceController.callMethod(route.property)]
              )
            );
        }

        this.router.use(kebabCase(entityMetadata.name), routerForController);
      } else {
        for (const route of routesMetadata) {
          const middlewaresMetaForRoute = getMetadataStorage()
            .middlewares.filter(
              (e) =>
                e.target.constructor === Object.getPrototypeOf(controller) &&
                e.level === "route"
            )
            .sort((a, b) => b.priority - a.priority);

          

          routerForController[route.method](
            route.path,
            middlewaresMetaForRoute.map((m) => this.useMiddleware(m.middleware,m.args)).concat(
              [instanceController.callMethod(route.property)]
            )
          );
        }

        this.router.use(controllerMetadata.routeName, routerForController);
      }
    }
  }

  private useMiddleware = (
    middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>,
    args?: unknown,
    context?: RouteContext
  ) => {
    const instance = new middleware();
    instance.init(context, args);
    container.registerInstance(middleware, instance);
    if (instance instanceof BaseMiddleware) {
      return (req, res, next) => {
        try {
          return instance.use(req, res, next, args);
        } catch (e) {
          return next(e);
        }
      };
    }
    if (instance instanceof BaseErrorMiddleware) {
      return (err, req, res, next) => {
        try {
          return instance.use(err, req, res, next, args);
        } catch (e) {
          return next(e);
        }
      };
    }
  };
}
