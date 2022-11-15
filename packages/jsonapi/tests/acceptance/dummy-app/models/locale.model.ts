import { BaseEntity, Entity, ManyToOne, OneToOne, PrimaryKey } from '@mikro-orm/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { ArticleModel } from './article.model.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { CommentModel } from './comment.model.js';

@Entity()
export class LocaleModel extends BaseEntity<LocaleModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @ManyToOne('CommentModel', 'locales')
  public declare comment: CommentModel;

  @OneToOne('ArticleModel', 'locale', {
    nullable: true
  })
  public article?: ArticleModel;
}
