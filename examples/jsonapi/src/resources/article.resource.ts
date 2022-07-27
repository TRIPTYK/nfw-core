import { Resource, Relationship, Attribute, JsonApiResource } from '@triptyk/nfw-jsonapi';
import { ArticleModel } from '../models/article.model.js';
import { UserResource } from './user.resource.js';

@JsonApiResource({
  entityName: 'articles',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute()
  declare title: string;

  @Attribute()
  declare type: string;

  @Relationship({
    otherResource: 'UserResource'
  })
  declare writer: UserResource;
}
