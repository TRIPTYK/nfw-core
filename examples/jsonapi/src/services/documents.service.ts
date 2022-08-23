import type { Loaded } from '@mikro-orm/core';
import { injectable } from '@triptyk/nfw-core';
import type { Resource, JsonApiContext } from '@triptyk/nfw-jsonapi';
import { ResourceService } from '@triptyk/nfw-jsonapi';
import type { DocumentModel } from '../models/document.model.js';

@injectable()
export class DocumentResourceService extends ResourceService<DocumentModel> {
  async updateOne (resource: Resource<DocumentModel>, _ctx: JsonApiContext<DocumentModel, Resource<DocumentModel>>): Promise<Loaded<DocumentModel, never>> {
    console.log(resource);

    const entity = await this.repository.findOneOrFail({ id: resource.id } as any);
    console.log('remove', entity.filename);
    return super.updateOne(resource, _ctx);
  }
}
