import { BaseEntity, PrimaryKey, Collection, OneToMany, Entity } from '@mikro-orm/core';
import type { CommentModel } from './comment.model.js';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @OneToMany('CommentModel', 'article')
  public comments = new Collection<CommentModel>(this);
}
