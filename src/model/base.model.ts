import {IModelize} from "../interfaces/IModelize.interface";
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel implements IModelize {
    public constructor(payload: Object = {}) {
        Object.assign(this, payload);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    public createdAt;

    @UpdateDateColumn({
        nullable: true
    })
    public updatedAt;
}