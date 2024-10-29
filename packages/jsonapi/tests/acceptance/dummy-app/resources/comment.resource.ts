// eslint-disable-next-line max-classes-per-file
import { MikroORM } from '@mikro-orm/core';
import { Attribute, JsonApiResource, Relationship, Resource, ResourceService } from '../../../../src/index.js';
import { CommentModel } from '../models/comment.model.js';
import type { ArticleResource } from './article.resource.js';
import type { LocaleResource } from './locale.resource.js';
import type { ArticleModel } from '../models/article.model.js';
import { container } from '@triptyk/nfw-core';

class CommentService extends ResourceService<ArticleModel> {
  public constructor () {
    super(container.resolve(MikroORM));
  }
}

@JsonApiResource({
  entityName: 'comment',
  entity: CommentModel,
  service: CommentService
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
