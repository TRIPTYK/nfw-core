import { NextFunction, Request, Response } from "express";
import {
  checkSchema,
  Location,
  ParamSchema,
  ValidationChain,
} from "express-validator";
import { singleton } from "tsyringe";
import { BaseMiddleware } from "./base.middleware";

export type ValidationMiddlewareArgs = {
  schema: Record<string, ParamSchema>;
  location?: Location[];
};

@singleton()
export class ValidationMiddleware extends BaseMiddleware {
  public async use(
    req: Request,
    response: Response,
    next: NextFunction,
    args: ValidationMiddlewareArgs
  ): Promise<any> {
    const { schema, location = ["body"] } = args;
    const validationChain: ValidationChain[] = checkSchema(schema, location);

    const res = await Promise.all(
      validationChain.map((validation) => validation.run(req))
    );

    const errors = [];

    for (const r of res) {
      if (r.array().length) {
        errors.push(r.array());
      }
    }

    if (errors.length !== 0) {
      return next(errors);
    }

    return next();
  }
}
