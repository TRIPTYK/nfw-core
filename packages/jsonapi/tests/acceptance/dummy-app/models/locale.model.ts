import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { CommentModel } from './comment.model.js';

@Entity()
export class LocaleModel extends BaseEntity<LocaleModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @ManyToOne('CommentModel', 'locales')
  public declare comment: CommentModel;
}
