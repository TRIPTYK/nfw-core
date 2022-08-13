import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import type { ArticleModel } from './article.model.js';

@Entity()
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
      id : string = v4();

  @Property()
    declare username : string;

    @OneToMany('ArticleModel', 'writer')
  public articles = new Collection<ArticleModel>(this);
}
