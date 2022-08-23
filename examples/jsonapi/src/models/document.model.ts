import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class DocumentModel extends BaseEntity<DocumentModel, 'id'> {
    @PrimaryKey({
      type: 'uuid'
    })
      id : string = v4();

    @Property()
    declare filename : string;
}
