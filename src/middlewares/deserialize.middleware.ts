import { NextFunction, Request, Response } from "express";
import { container, singleton } from "tsyringe";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
import { BaseMiddleware } from "./base.middleware";

export type DeserializeMiddlewareArgs = {
  serializer: Constructor<BaseJsonApiSerializer<any>>;
  schema?: string;
};

@singleton()
export class DeserializeMiddleware extends BaseMiddleware {
  public async use(
    req: Request,
    response: Response,
    next: NextFunction,
    args: DeserializeMiddlewareArgs
  ): Promise<any> {
    if (!req.body.data) {
      return next();
    }
    // console.log("before");
    // console.log(req.body);

    const fields = await container
      .resolve(args.serializer)
      .deserialize(req.body);
    req.body = {};
    // req.body = req.body.data;
    // console.log("assignation");

    // console.log(req.body);

    // req.body = fields;
    for (const key in fields) {
      if (key !== "id") {
        req.body[key] = fields[key];
      } else {
        delete req.body[key];
      }
    }

    return next();
  }
}
