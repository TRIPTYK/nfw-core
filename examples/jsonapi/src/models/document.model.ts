import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class DocumentModel extends BaseEntity<DocumentModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
  public id : string = v4();

    @Property()
    public declare filename : string;
}
