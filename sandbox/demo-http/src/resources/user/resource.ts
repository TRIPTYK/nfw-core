import { injectable } from '@triptyk/nfw-core';
import { AbstractResource } from 'resources';

@injectable()
export class UserResource extends AbstractResource {
  id?: string | undefined;

  declare name: string;
}
