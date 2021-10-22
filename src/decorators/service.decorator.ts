import { autoInjectable, container } from "tsyringe";
import { BaseService } from "..";
import { getMetadataStorage } from "../metadata/metadata-storage";
import { Constructor } from "../types/global";

export function Service()  {
  return function <T extends Constructor<BaseService>>(target: T): void {
    container.registerSingleton(target);
    autoInjectable()(target);
    getMetadataStorage().services.push({
      target
    });
  }
}