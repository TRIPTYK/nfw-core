import { Request, Response } from "express";
import { ErrorMiddlewareInterface } from "../interfaces/middleware.interface";

export abstract class BaseErrorMiddleware implements ErrorMiddlewareInterface {
    public abstract use(
        err: unknown,
        req: Request,
        res: Response,
        next: (err?: unknown) => void,
        args: unknown
    ): any;
}
