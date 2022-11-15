import { Attribute, JsonApiResource, Relationship, Resource } from '../../../../src/index.js';
import { ArticleModel } from '../models/article.model.js';
import type { CommentResource } from './comment.resource.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { LocaleResource } from './locale.resource.js';

@JsonApiResource({
  entityName: 'article',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute({
    filterable: {
      $like: true
    }
  })
  public id?: string | undefined;

  @Relationship({
    otherResource: 'CommentResource'
  })
  public declare comments: CommentResource[];

  @Relationship({
    otherResource: 'LocaleResource'
  })
  public declare locale: LocaleResource;
}
