import { BaseEntity, Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import type { UserModel } from './user.model.js';
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

    @ManyToOne('UserModel', {
      inversedBy: 'articles',
      wrappedReference: true
    })
    declare writer: IdentifiedReference<UserModel>;
}
