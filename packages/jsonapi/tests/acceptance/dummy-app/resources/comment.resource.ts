import { Attribute, JsonApiResource, Relationship, Resource } from '../../../../src/index.js';
import { CommentModel } from '../models/comment.model.js';
import type { ArticleResource } from './article.resource.js';

@JsonApiResource({
  entityName: 'comment',
  entity: CommentModel
})
export class CommentResource extends Resource<CommentModel> {
  @Attribute()
  public id?: string | undefined;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare article: ArticleResource[];
}
