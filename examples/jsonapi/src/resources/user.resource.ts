import type { Resource } from '@triptyk/nfw-jsonapi';
import { Relationship, Attribute, JsonApiResource } from '@triptyk/nfw-jsonapi';
import { UserModel } from '../models/user.model.js';
import type { ArticleResource } from './article.resource.js';

@JsonApiResource({
  entity: UserModel,
  entityName: 'user'
})
export class UserResource implements Resource<UserModel> {
   @Attribute()
  declare id: string;

  @Attribute()
   declare username: string;

   @Relationship({
     otherResource: 'ArticleResource'
   })
  declare articles: ArticleResource[];
}
