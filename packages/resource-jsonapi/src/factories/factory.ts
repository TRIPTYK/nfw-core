import { Promisable } from "type-fest";


export interface ResourceFactory<T> {
    create(payload: T): Promisable<T>,
}
