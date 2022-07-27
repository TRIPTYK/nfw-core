import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserModel } from './user.model.js';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
    @PrimaryKey()
  declare id : string;

    @Property()
    declare title : string;

    @Property({
      default: 'truc'
    })
    declare type? : string;

    @ManyToOne('UserModel', 'articles')
    declare writer: UserModel;
}
