import { ParamSchema } from "express-validator";
export declare type ValidationSchema<T> = {
    [P in keyof T]?: ParamSchema;
};
