
import { Relationship, Attribute, JsonApiResource, Resource, Number } from '@triptyk/nfw-jsonapi';
import { UserModel } from '../models/user.model.js';
import type { ArticleResource } from './article.resource.js';

@JsonApiResource({
  entity: UserModel,
  entityName: 'users'
})
export class UserResource extends Resource<UserModel> {
  @Attribute({
    filterable: false,
    sortable: ['ASC']
  })
  declare id: string;

  @Attribute()
  @Number()
  declare username: string;

   @Relationship({
     otherResource: 'ArticleResource'
   })
  declare articles: ArticleResource[];
}
