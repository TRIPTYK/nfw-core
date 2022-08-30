import { Resource, Relationship, Attribute, JsonApiResource } from '@triptyk/nfw-jsonapi';
import { ArticleModel } from '../models/article.model.js';
import { UserResource } from './user.resource.js';

@JsonApiResource({
  entityName: 'articles',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute({
    filterable: {
      $eq: true
    },
    sortable: ['ASC']
  })
  public declare id: string;

  @Attribute({
    filterable: {
      $eq: true,
      $contains: true,
      $in: true
    },
    sortable: ['ASC']
  })
  public declare title: string;

  @Attribute()
  public declare type: string;

  @Relationship<ArticleResource>({
    otherResource: 'UserResource'
  })
  public declare writer: UserResource;
}
