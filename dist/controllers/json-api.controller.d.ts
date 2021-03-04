import { Request, Response } from "express";
import { JsonApiModel } from "../models/json-api.model";
import { BaseJsonApiRepository } from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
import { BaseController } from "./base.controller";
export declare abstract class BaseJsonApiController<T extends JsonApiModel<T>> extends BaseController {
    entity: Constructor<T>;
    protected serializer: BaseJsonApiSerializer<T>;
    protected repository: BaseJsonApiRepository<T>;
    constructor();
    callMethod(methodName: string): any;
    list(req: Request, _res: Response): Promise<any>;
    get(req: Request, _res: Response): Promise<any>;
    create(req: Request, _res: Response): Promise<any>;
    update(req: Request, _res: Response): Promise<any>;
    remove(req: Request, res: Response): Promise<any>;
    fetchRelationships(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchRelated(req: Request, res: Response): Promise<any>;
    addRelationships(req: Request, res: Response): Promise<any>;
    updateRelationships(req: Request, res: Response): Promise<any>;
    removeRelationships(req: Request, res: Response): Promise<any>;
    protected parseJsonApiQueryParams(query: Record<string, any>): {
        includes: string[];
        sort: string[];
        fields: any;
        page: any;
        filter: any;
    };
}
