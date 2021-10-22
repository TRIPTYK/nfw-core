import { Request, Response } from "express";
import { ControllerInterface } from "../interfaces/controller.interface";

export abstract class BaseController implements ControllerInterface {
  public name: string;

  public callMethod(methodName: string) {
    const middlewareFunction = async (
      req: Request,
      res: Response,
      next: (arg0: any) => any
    ) => {
      try {
        const response = await this[methodName](req, res);
        if (!res.headersSent) {
          res.send(response);
        }
      } catch (e) {
        return next(e);
      }
    };
    return middlewareFunction.bind(this);
  }

  public init() {
    // eslint-disable-next-line no-useless-return
    return;
  }
}
