import kebabCase from "@queso/kebab-case";
import { NextFunction, Response, Router } from "express";
import { container } from "tsyringe";
import { Request } from "express";
import {
  Constructor,
  BaseMiddleware,
  BaseErrorMiddleware,
  BaseController,
} from "..";
import {
  ControllerRoutesMetadataArgs,
  getMetadataStorage,
  UseGuardsMetadataArgs,
  UseParamsMetadataArgs,
  UseResponseHandlerMetadataArgs,
} from "../metadata/metadata-storage";
import isClass from "is-class";

function useMiddleware(
  middleware:
    | Constructor<BaseMiddleware | BaseErrorMiddleware>
    | ((req: Request, res: Response, next: NextFunction) => unknown),
  args?: unknown
) {
  if (isClass(middleware)) {
    const middlewareInstanceClass = middleware as Constructor<
      BaseMiddleware | BaseErrorMiddleware
    >;
    const instance = new middlewareInstanceClass();
    container.registerInstance(middlewareInstanceClass, instance);
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
  } else {
    return middleware as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => unknown;
  }
}

const useParam = (paramMeta: UseParamsMetadataArgs, req: Request) => {
  switch (paramMeta.type) {
    case "body":
      return req.body;
    case "param":
      return req.params[paramMeta.args[0] as string];
  }
};

function handleControllerContext(
  controllerInstance: BaseController,
  guardsMeta: UseGuardsMetadataArgs[],
  responseHandlerMeta: UseResponseHandlerMetadataArgs,
  routeMeta: ControllerRoutesMetadataArgs,
  params: UseParamsMetadataArgs[]
) {
  const controllerMethodReference = controllerInstance[
    routeMeta.property
  ] as Function;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * We call the controller method with the parameters
       */
      const guardResponses = await Promise.all(
        guardsMeta.map((guardMeta) => {
          const guardInstance = container.resolve(guardMeta.guard);
          return guardInstance.can({
            controller: controllerInstance,
            request: req,
            method: routeMeta.property,
            args: guardMeta.args,
          });
        })
      );

      if (guardResponses.includes(false)) {
        throw new Error("unauthorized");
      }

      const response = await controllerMethodReference.call(
        controllerInstance,
        ...params.map((e) => useParam(e, req))
      );

      if (responseHandlerMeta) {
        const handlerInstance = container.resolve(
          responseHandlerMeta.responseHandler
        );
        return handlerInstance.handle({
          controller: controllerInstance,
          response: res,
          method: routeMeta.property,
          args: responseHandlerMeta.args,
        });
      } else {
        res.send(response);
      }
    }catch(e) {
      console.log(e);
      res.status(500);
      res.send(e.message);
    }
  };
}

export function buildApplication(controllers: Constructor<BaseController>[]) {
  const router = Router();

  const globalMiddlewares = getMetadataStorage()
    .useMiddlewares.filter((e) => e.level === "application")
    .sort((a, b) => b.priority - a.priority);

  if (globalMiddlewares.length) {
    router.use(
      globalMiddlewares.map((e) => useMiddleware(e.middleware, e.args))
    );
  }

  for (const controller of controllers) {
    const routerForController = Router();
    const instanceController = container.resolve(controller);
    const controllerMetadata = getMetadataStorage().controllers.find(
      (e) => e.target === controller
    );
    const controllerMiddlewares = getMetadataStorage()
      .useMiddlewares.filter((e) => {
        return (
          e.target === Object.getPrototypeOf(controller) &&
          e.level === "controller"
        );
      })
      .sort((a, b) => b.priority - a.priority);
    const routesMetadata = getMetadataStorage().controllerRoutes.filter((e) => {
      return e.target.constructor === Object.getPrototypeOf(controller);
    });

    const middlewareForController = controllerMiddlewares.map((e) =>
      useMiddleware(e.middleware, e.args)
    );

    if (controllerMiddlewares.length) {
      routerForController.use(...middlewareForController);
    }

    if (controllerMetadata.type === "json-api") {
      // router.use(kebabCase(entityMetadata.name), routerForController);
    } else {
      for (const route of routesMetadata) {
        const middlewaresMetaForRoute = getMetadataStorage()
          .useMiddlewares.filter(
            (e) =>
              e.target.constructor === Object.getPrototypeOf(controller) &&
              e.level === "route"
          )
          .sort((a, b) => b.priority - a.priority);
        const paramsForRoute = getMetadataStorage().useParams.filter(
          (e) =>
            e.target.constructor === Object.getPrototypeOf(controller) &&
            e.property === route.property
        );
        const guardsForRoute = getMetadataStorage().useGuards.filter(
          /**
           * When propertyname is undefined it means guard is for all route
           * Because we need the context and args of each route, we need to apply on each sub route and not on the top level route
           */
          (e) =>
            e.target.constructor === Object.getPrototypeOf(controller) &&
            (e.propertyName === route.property || e.propertyName === undefined)
        );
        const reponseHandlersForRoute =
          getMetadataStorage().useResponseHandlers.find(
            (e) =>
              e.target.constructor === Object.getPrototypeOf(controller) &&
              (e.propertyName === route.property ||
                e.propertyName === undefined)
          );

        const middlewaresMapped = middlewaresMetaForRoute.map((m) =>
          useMiddleware(m.middleware, m.args)
        );
        middlewaresMapped.push(
          handleControllerContext(
            instanceController,
            guardsForRoute,
            reponseHandlersForRoute,
            route,
            paramsForRoute
          )
        );

        routerForController[route.method](route.path, middlewaresMapped);
      }

      router.use(controllerMetadata.routeName, routerForController);
    }
  }
  return router;
}
