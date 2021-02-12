import { NextFunction, Request, Response } from "express";
import { BaseErrorMiddleware } from "./base.error-middleware";
export declare class ErrorMiddleware extends BaseErrorMiddleware {
    private serializer;
    use(error: any, req: Request, res: Response, next: NextFunction, args: any): void;
}
