import { container } from '@triptyk/nfw-core';
import { HttpMethod } from '../storages/metadata/endpoint.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function createHttpVerbDecorator (routeName: string, verb: HttpMethod) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: verb
    });
  };
}

export function GET (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.GET);
}

export function POST (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.POST);
}

export function PATCH (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.PATCH);
}
export function DELETE (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.DELETE);
}

export function OPTIONS (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.OPTIONS);
}

export function PUT (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.PUT);
}

export function HEAD (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.HEAD);
}

export function ALL (routeName: `/${string}`) {
  return createHttpVerbDecorator(routeName, HttpMethod.ALL);
}
