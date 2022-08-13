import { JsonApiController, JsonApiGet, JsonApiList } from '@triptyk/nfw-jsonapi';
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
  async list () {}

  @JsonApiGet()
  async get () {}
}
