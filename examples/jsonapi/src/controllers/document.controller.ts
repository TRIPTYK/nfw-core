import { UseMiddleware } from '@triptyk/nfw-http';
import { JsonApiController, JsonApiGet, JsonApiList, JsonApiCreate, JsonApiUpdate, JsonApiDelete, JsonApiGetRelationships, JsonApiGetRelated } from '@triptyk/nfw-jsonapi';
import koaBody from 'koa-body';
import { DocumentResource } from '../resources/document.resource.js';

@JsonApiController(DocumentResource)
export class DocumentController {
  @JsonApiList()
  public async list () {}

  @JsonApiGet()
  public async get () {}

  @JsonApiCreate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true
  })
  @UseMiddleware(koaBody({
    multipart: true,
    json: false
  }))
  public async create () {}

  @UseMiddleware(koaBody({
    multipart: true,
    json: false
  }))
  @JsonApiUpdate({
    allowedContentType: 'multipart/form-data',
    ignoreMedia: true
  })
  public async update () {}

  @JsonApiDelete()
  public async delete () {}

  @JsonApiGetRelationships()
  public async relationships () {}

  @JsonApiGetRelated()
  public async related () {}
}
