import { Request, Response } from "express";

export interface MiddlewareInterface {
  use(req: Request, res: Response, next: (err?: any) => void, args: any): any;
}

export interface ErrorMiddlewareInterface {
  use(
    err: any,
    req: Request,
    res: Response,
    next: (err?: any) => void,
    args: any
  ): any;
}
