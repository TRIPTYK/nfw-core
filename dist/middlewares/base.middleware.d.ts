import { Request, Response } from "express";
import { RouteContext } from "../application/base.application";
import { MiddlewareInterface } from "../interfaces/middleware.interface";
export declare abstract class BaseMiddleware implements MiddlewareInterface {
    protected context: RouteContext;
    init(context: RouteContext): void;
    abstract use(req: Request, res: Response, next: (err?: any) => void, args: any): any;
}
