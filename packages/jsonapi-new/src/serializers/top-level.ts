import type { RegistryInterface } from '../interfaces/registry.js';
import type { ResourceInterface } from '../interfaces/resource.js';
import type { TopLevelSerializerInterface } from '../interfaces/top-level-serializer.js';
import { TopLevelSerializationRun } from './top-level-run.js';

export class TopLevelSerializer implements TopLevelSerializerInterface {
  public constructor (
    public registry : RegistryInterface
  ) {}

  public serialize (resource: ResourceInterface | ResourceInterface[] | null) {
    const run = new TopLevelSerializationRun(this.registry, resource);
    return run.serialize();
  }
}
