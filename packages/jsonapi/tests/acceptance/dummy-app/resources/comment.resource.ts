import { Attribute, JsonApiResource, Relationship, Resource } from '../../../../src/index.js';
import { CommentModel } from '../models/comment.model.js';
import type { ArticleResource } from './article.resource.js';
import type { LocaleResource } from './locale.resource.js';

@JsonApiResource({
  entityName: 'comment',
  entity: CommentModel
})
export class CommentResource extends Resource<CommentModel> {
  @Attribute({
    filterable: {
      $eq: true,
      $like: true
    }
  })
  public id?: string | undefined;

  @Attribute({
    filterable: {
      $eq: true,
      $like: true
    }
  })
  public title?: string | undefined;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare article: ArticleResource[];

  @Relationship({
    otherResource: 'LocaleResource'
  })
  public declare locales: LocaleResource[];
}
