import { UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiController, JsonApiGet, JsonApiList, JsonApiCreate, JsonApiUpdate, JsonApiDelete, JsonApiGetRelationships, JsonApiGetRelated } from '@triptyk/nfw-jsonapi';
import koaBody from 'koa-body';
import { DocumentResource } from '../resources/document.resource.js';

@JsonApiController(DocumentResource)
export class DocumentController {
  @JsonApiList()
  async list () {}

  @JsonApiGet()
  async get () {}

  @JsonApiCreate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true
  })
  @UseMiddleware(koaBody({
    multipart: true,
    json: false
  }))
  async create () {

  }

  @UseMiddleware(koaBody({
    multipart: true,
    json: false
  }))
  @JsonApiUpdate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true
  })
  async update () {}

  @JsonApiDelete()
  async delete () {}

  @JsonApiGetRelationships()
  async relationships () {}

  @JsonApiGetRelated()
  async related () {}
}
