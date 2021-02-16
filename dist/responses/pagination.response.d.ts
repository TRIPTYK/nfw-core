import { PaginationParams } from "../serializers/base.serializer";
import { Response } from "./response.response";
export declare class PaginationResponse extends Response {
    paginationData: PaginationParams;
    constructor(body: any, paginationData: PaginationParams, { status, type }?: {
        status: number;
        type: string;
    });
}
