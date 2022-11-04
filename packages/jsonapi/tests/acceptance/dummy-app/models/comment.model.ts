import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ArticleModel } from './article.model.js';

@Entity()
export class CommentModel extends BaseEntity<CommentModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @Property({
    default: 'title'
  })
  public declare title?: string;

  @ManyToOne('ArticleModel', 'comments')
  public declare article: ArticleModel;
}
