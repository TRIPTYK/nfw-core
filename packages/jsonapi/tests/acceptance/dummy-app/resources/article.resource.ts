import { Attribute, JsonApiResource, Relationship, Resource } from '../../../../src/index.js';
import { ArticleModel } from '../models/article.model.js';
import type { CommentResource } from './comment.resource.js';

@JsonApiResource({
  entityName: 'article',
  entity: ArticleModel
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute()
  public id?: string | undefined;

  @Relationship({
    otherResource: 'CommentResource'
  })
  public declare comments: CommentResource[];
}
