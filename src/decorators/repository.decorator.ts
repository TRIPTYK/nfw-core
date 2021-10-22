
import { getMetadataArgsStorage } from "typeorm";
import { BaseJsonApiModel, BaseJsonApiRepository, Constructor } from "..";
import { getMetadataStorage } from "../metadata/metadata-storage";

export function JsonApiRepository(entity:  Constructor<BaseJsonApiModel<unknown>>) {
  return function(target: Constructor<BaseJsonApiRepository<unknown>>): void {
    getMetadataArgsStorage().entityRepositories.push({
      target,
      entity,
    });
    getMetadataStorage().repositories.push({
      target,
      entity
    })
  }
}