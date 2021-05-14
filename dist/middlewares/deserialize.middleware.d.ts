import { NextFunction, Request, Response } from "express";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
import { BaseMiddleware } from "./base.middleware";
export declare type DeserializeMiddlewareArgs = {
    serializer: Constructor<BaseJsonApiSerializer<any>>;
    schema?: string;
};
export declare class DeserializeMiddleware extends BaseMiddleware {
    use(req: Request, response: Response, next: NextFunction, args: DeserializeMiddlewareArgs): Promise<any>;
}
