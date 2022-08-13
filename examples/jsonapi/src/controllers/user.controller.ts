import { JsonApiController, JsonApiGet, JsonApiList, ServiceResponse } from '@triptyk/nfw-jsonapi';
import type { UserModel } from '../models/user.model.js';
import { UserResource } from '../resources/user.resource.js';

/**
 * Validation of
 *  - query
 *  - body
 *
 * Fine grained authorization
 *  - From repository for read
 *  - For each update create
 *
 *  - custom content-type
 *  - custom serializer
 *
 */
@JsonApiController(UserResource)
export class UserController {
  @JsonApiList()
  async list (@ServiceResponse() serviceResponse: UserModel[]) {
    return serviceResponse;
  }

  @JsonApiGet()
  async get () {
    return [];
  }
}
