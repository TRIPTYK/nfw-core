import { MetadataStorage } from '../../index.js';

export interface ControllerContextObject {
    controllerAction: string,
    controllerInstance: any,
}

/**
 *
 */
export function ControllerContext (this : unknown) {
  return function (target: unknown, propertyKey: string, index: number) {
    MetadataStorage.instance.useParams.push({
      target,
      propertyName: propertyKey,
      index,
      decoratorName: 'ControllerContext', // context will never be shared or cached, i just don't want Typescript to be angry at me
      handle: 'controller-context',
      args: [],
      cache: false
    });
  }
}
