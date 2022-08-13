import { Context, JsonApiController, JsonApiGet, JsonApiList } from '@triptyk/nfw-jsonapi';
import { JsonApiContext } from '@triptyk/nfw-jsonapi/dist/src/interfaces/json-api-context.js';
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
  async list (@Context() jsonApiContext: JsonApiContext<UserModel>) {
    console.log(jsonApiContext);
    return [];
  }

  @JsonApiGet()
  async get () {
    return [];
  }
}
