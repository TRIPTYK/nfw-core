import * as Express from "express";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ControllerInterface {
  init(router: Express.Router);
}
