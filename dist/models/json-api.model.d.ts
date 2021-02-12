import { BaseModel } from "./base.model";
export declare abstract class JsonApiModel<T> extends BaseModel {
    id: number;
    constructor(payload?: Partial<T>);
}
