import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ArticleModel } from './article.model.js';

@Entity()
export class CommentModel extends BaseEntity<CommentModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @ManyToOne('ArticleModel', 'comments')
  public declare article: ArticleModel;
}
