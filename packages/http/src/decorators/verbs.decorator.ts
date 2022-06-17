import { RouteMethod } from '../interfaces/endpoint.metadata.js';
import { MetadataStorage } from '../storages/metadata-storage.js';

export function GET (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.GET
    });
  }
}

export function POST (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.POST
    });
  }
}

export function PATCH (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.PATCH
    });
  }
}
export function DELETE (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.DELETE
    });
  }
}

export function OPTIONS (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.OPTIONS
    });
  }
}

export function PUT (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.PUT
    });
  }
}

export function HEAD (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.HEAD
    });
  }
}

export function ALL (routeName: `/${string}`) {
  return function (target: unknown, propertyKey: string) {
    MetadataStorage.instance.endpoints.push({
      target,
      propertyName: propertyKey,
      args: {
        routeName
      },
      method: RouteMethod.ALL
    });
  }
}
