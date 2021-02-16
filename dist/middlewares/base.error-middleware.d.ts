import { Request, Response } from "express";
import { RouteContext } from "../application/base.application";
import { ErrorMiddlewareInterface } from "../interfaces/middleware.interface";
export declare abstract class BaseErrorMiddleware implements ErrorMiddlewareInterface {
    protected context: RouteContext;
    init(context: RouteContext): void;
    abstract use(err: any, req: Request, res: Response, next: (err?: any) => void, args: any): any;
}
