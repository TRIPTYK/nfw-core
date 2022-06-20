import { Resource, Relationship, Attribute, JsonApiResource } from '@triptyk/nfw-jsonapi';
import { ArticleModel } from '../models/article.model.js';
import { UserResource } from './user.resource.js';

@JsonApiResource({
  entityName: 'article',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute()
  declare id: string;

  @Attribute()
  declare title: string;

  @Relationship({
    otherResource: 'UserResource'
  })
  declare author: UserResource;
}
