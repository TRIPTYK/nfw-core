
import type { Class } from '@triptyk/nfw-core';
import { MetadataStorage, RouteMethod } from '@triptyk/nfw-http';

export function JsonApiGet () {
  return function (target: Class<unknown>, propertyName: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName,
      method: RouteMethod.GET,
      args: jsonapiGet
    });
  }
}
