import * as Express from "express";
export interface ControllerInterface {
    init(router: Express.Router): any;
}
