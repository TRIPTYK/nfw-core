import { JsonApiController, JsonApiList } from '@triptyk/nfw-jsonapi';
import { UserResource } from '../resources/user.resource.js';

@JsonApiController(UserResource)
export class UserController {
  @JsonApiList()
  async list () {
    return [];
  }
}
