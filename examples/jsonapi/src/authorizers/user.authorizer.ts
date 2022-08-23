import { injectable } from '@triptyk/nfw-core';
import type { Resource } from '@triptyk/nfw-jsonapi';
import { RoleServiceAuthorizer } from '@triptyk/nfw-jsonapi';
import type { JsonApiContext } from '@triptyk/nfw-jsonapi/dist/src/interfaces/json-api-context.js';
import type { UserModel } from '../models/user.model.js';

@injectable()
export class UserAuthorizer extends RoleServiceAuthorizer<UserModel, UserModel> {
  read (user: UserModel | undefined, r: UserModel, c: JsonApiContext<any, Resource<any>>): boolean | Promise<boolean> {
    return true;
  }

  create (user: UserModel | undefined, r: UserModel, c: JsonApiContext<any, Resource<any>>): boolean | Promise<boolean> {
    return true;
  }

  update (user: UserModel | undefined, r: UserModel, c: JsonApiContext<any, Resource<any>>): boolean | Promise<boolean> {
    return true;
  }

  remove (user: UserModel | undefined, r: UserModel, c: JsonApiContext<any, Resource<any>>): boolean | Promise<boolean> {
    return true;
  }
}
