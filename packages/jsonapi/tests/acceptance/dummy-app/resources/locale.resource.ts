/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Attribute, JsonApiResource, Relationship, Resource } from '../../../../src/index.js';
import { LocaleModel } from '../models/locale.model.js';
import type { ArticleResource } from './article.resource.js';
import type { CommentResource } from './comment.resource.js';

@JsonApiResource({
  entityName: 'locale',
  entity: LocaleModel
})
export class LocaleResource extends Resource<LocaleModel> {
  @Attribute({
    filterable: {
      $like: true
    }
  })
  public id?: string | undefined;

  @Relationship({
    otherResource: 'CommentResource'
  })
  public declare comment: CommentResource;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare article: ArticleResource;
}
