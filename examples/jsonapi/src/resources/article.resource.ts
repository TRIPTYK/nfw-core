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
  declare id: string;

  @Attribute({
    filterable: {
      $eq: true,
      $contains: true,
      $in: true
    },
    sortable: ['ASC']
  })
  declare title: string;

  @Attribute()
  declare type: string;

  @Relationship<ArticleResource>({
    otherResource: 'UserResource'
  })
  declare writer: UserResource;

  validate (): void {}
}
