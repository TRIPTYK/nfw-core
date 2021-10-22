import { PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseJsonApiModel<T> {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    public constructor(payload: Partial<T> = {}) {
        Object.assign(this, payload);
    }
}
