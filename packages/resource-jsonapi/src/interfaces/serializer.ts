import { Promisable } from "type-fest";

export interface PaginationData {
  number: number;
  size: number;
  total: number;
}

export interface ResourceSerializer<T extends Record<string, unknown>> {
    serializeOne(resource: T): Promisable<unknown>;
    serializeMany(resource: T[], pageQuery?: PaginationData): Promisable<unknown>;
}