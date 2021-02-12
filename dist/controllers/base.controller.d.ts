import { ControllerInterface } from "../interfaces/controller.interface";
export declare abstract class BaseController implements ControllerInterface {
    name: string;
    constructor();
    callMethod(methodName: string): any;
    init(): void;
}
