import { Resource, Relationship, Attribute, JsonApiResource, String } from '@triptyk/nfw-jsonapi';
import { ArticleModel } from '../models/article.model.js';
import { UserResource } from './user.resource.js';

@JsonApiResource({
  entityName: 'articles',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute({
    filterable: {
      $eq: (value: unknown) => (value as string) === 'a'
    },
    sortable: ['ASC']
  })
  declare id: string;

  @Attribute({
    filterable: {
      $eq: (value: unknown) => (value as string).includes('amaury'),
      $contains: true
    },
    sortable: ['ASC']
  })
  @String()
  declare title: string;

  @Attribute()
  @String()
  declare type: string;

  @Relationship({
    otherResource: 'UserResource'
  })
  @String()
  declare writer: UserResource;
}
