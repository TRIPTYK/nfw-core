import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { JsonApiController, JsonApiGet, JsonApiList, JsonApiCreate, JsonApiUpdate } from '@triptyk/nfw-jsonapi';
import { UserModel } from '../models/user.model.js';
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
@JsonApiController(UserResource, {
  currentUser () {
    const mikroORM = container.resolve(MikroORM);
    return mikroORM.em.getRepository(UserModel).findAll().then((e) => e[0]) as any;
  }
})
export class UserController {
  @JsonApiList()
  async list () {}

  @JsonApiGet()
  async get () {}

  @JsonApiCreate()
  async create () {}

  @JsonApiUpdate()
  async update () {}
}
