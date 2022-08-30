import { MikroORM } from '@mikro-orm/core';
import { container } from '@triptyk/nfw-core';
import { JsonApiController, JsonApiGet, JsonApiList, JsonApiCreate, JsonApiUpdate, JsonApiDelete, JsonApiGetRelationships, JsonApiGetRelated } from '@triptyk/nfw-jsonapi';
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
    return mikroORM.em.getRepository(UserModel).findAll().then((e) => e[1]) as any;
  }
})
export class UserController {
  @JsonApiList()
  public async list () {}

  @JsonApiGet()
  public async get () {}

  @JsonApiCreate()
  public async create () {}

  @JsonApiUpdate()
  public async update () {}

  @JsonApiDelete()
  public async delete () {}

  @JsonApiGetRelationships()
  public async relationships () {}

  @JsonApiGetRelated()
  public async related () {}
}
