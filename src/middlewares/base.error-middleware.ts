import { Request, Response } from "express";
import { ErrorMiddlewareInterface } from "../interfaces/middleware.interface";
import { RouteContext } from "../interfaces/routes.interface";

export abstract class BaseErrorMiddleware implements ErrorMiddlewareInterface {
    protected context: RouteContext;
    public init(context: RouteContext) {
        this.context = context;
    }
    public abstract use(
        err: any,
        req: Request,
        res: Response,
        next: (err?: any) => void,
        args: any
    ): any;
}
