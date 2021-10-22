import { PrimaryGeneratedColumn } from "typeorm";

export abstract class JsonApiModel<T> {
    @PrimaryGeneratedColumn()
    public id: number;

    public constructor(payload: Partial<T> = {}) {
        Object.assign(this, payload);
    }
}
