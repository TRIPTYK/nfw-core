/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseJsonApiModel } from "../models/json-api.model";
import { BaseController } from "./base.controller";

export abstract class BaseJsonApiController<
  T extends BaseJsonApiModel<T>
> extends BaseController {
}
