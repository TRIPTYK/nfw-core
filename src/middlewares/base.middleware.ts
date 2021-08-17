import { Request, Response } from "express";
import { MiddlewareInterface } from "../interfaces/middleware.interface";
import { RouteContext } from "../interfaces/routes.interface";

export abstract class BaseMiddleware implements MiddlewareInterface {
  protected context: RouteContext;

  public init(context: RouteContext,args: any) {
    this.context = context;
  }
  public abstract use(
    req: Request,
    res: Response,
    next: (err?: any) => void,
    args: any
  ): any;
}
