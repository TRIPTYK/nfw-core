
import { Attribute, JsonApiResource, Resource } from '@triptyk/nfw-jsonapi';
import { DocumentDeserializer } from '../deserializers/document.deserializer.js';
import { DocumentModel } from '../models/document.model.js';
import { DocumentResourceService } from '../services/documents.service.js';

@JsonApiResource({
  entity: DocumentModel,
  entityName: 'documents',
  deserializer: DocumentDeserializer,
  service: DocumentResourceService
})
export class DocumentResource extends Resource<DocumentModel> {
  @Attribute({
    filterable: false,
    sortable: ['ASC']
  })
  declare id: string;

  @Attribute()
  declare filename: string;

  validate (): void {}
}
