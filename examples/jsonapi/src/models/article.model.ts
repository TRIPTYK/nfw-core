import { BaseEntity, Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import type { UserModel } from './user.model.js';
import { v4 } from 'uuid';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
  public id : string = v4();

    @Property()
    public declare title : string;

    @Property({
      default: 'truc'
    })
    public declare type? : string;

    @ManyToOne('UserModel', {
      inversedBy: 'articles',
      wrappedReference: true,
      nullable: true
    })
    public declare writer: IdentifiedReference<UserModel>;
}
