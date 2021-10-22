import { Request, Response } from "express";
import { ControllerInterface } from "../interfaces/controller.interface";

export abstract class BaseController implements ControllerInterface {
  public init() {
    // eslint-disable-next-line no-useless-return
    return;
  }
}
