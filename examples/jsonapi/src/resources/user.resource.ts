
import { Relationship, Attribute, JsonApiResource, Resource } from '@triptyk/nfw-jsonapi';
import { UserAuthorizer } from '../authorizers/user.authorizer.js';
import { UserModel } from '../models/user.model.js';
import type { ArticleResource } from './article.resource.js';

@JsonApiResource({
  entity: UserModel,
  entityName: 'users',
  authorizer: UserAuthorizer
})
export class UserResource extends Resource<UserModel> {
  validate (): void {}

  @Attribute({
    filterable: false,
    sortable: ['ASC']
  })
  declare id: string;

  @Attribute()
  declare username: string;

   @Relationship({
     otherResource: 'ArticleResource'
   })
  declare articles: ArticleResource[];
}
