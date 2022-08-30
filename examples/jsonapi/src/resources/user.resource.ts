
import { Relationship, Attribute, JsonApiResource, Resource } from '@triptyk/nfw-jsonapi';
import { UserModel } from '../models/user.model.js';
import type { ArticleResource } from './article.resource.js';

@JsonApiResource({
  entity: UserModel,
  entityName: 'users'
})
export class UserResource extends Resource<UserModel> {
  @Attribute({
    filterable: {
      $eq: true
    },
    sortable: ['ASC']
  })
  public declare id: string;

  @Attribute()
  public declare username: string;

  @Attribute()
  public declare role: string;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare articles: ArticleResource[];
}
