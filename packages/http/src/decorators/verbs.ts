import { container } from '@triptyk/nfw-core';
import { HttpMethod } from '../interfaces/endpoint.metadata.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function GET (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.GET
    });
  }
}

export function POST (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.POST
    });
  }
}

export function PATCH (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.PATCH
    });
  }
}
export function DELETE (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.DELETE
    });
  }
}

export function OPTIONS (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.OPTIONS
    });
  }
}

export function PUT (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.PUT
    });
  }
}

export function HEAD (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.HEAD
    });
  }
}

export function ALL (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    container.resolve(MetadataStorage).endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: HttpMethod.ALL
    });
  }
}
