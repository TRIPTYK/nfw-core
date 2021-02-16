import { NextFunction, Request, Response } from "express";
import { Location, ParamSchema } from "express-validator";
import { BaseMiddleware } from "./base.middleware";
export declare type ValidationMiddlewareArgs = {
    schema: Record<string, ParamSchema>;
    location?: Location[];
};
export declare class ValidationMiddleware extends BaseMiddleware {
    use(req: Request, response: Response, next: NextFunction, args: ValidationMiddlewareArgs): Promise<any>;
}
