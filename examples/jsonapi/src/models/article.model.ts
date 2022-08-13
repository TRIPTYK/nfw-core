import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserModel } from './user.model.js';
import { v4 } from 'uuid';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
      id : string = v4();

    @Property()
    declare title : string;

    @Property({
      default: 'truc'
    })
    declare type? : string;

    @ManyToOne('UserModel', 'articles')
    declare writer: UserModel;
}
