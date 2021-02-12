import { Request, Response } from "express";
import { BaseMiddleware } from "./base.middleware";
export declare class NotFoundMiddleware extends BaseMiddleware {
    private serializer;
    use(req: Request, res: Response, next: (err?: any) => void, args: any): void;
}
