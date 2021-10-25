import { MetadataStorage } from '../storage/metadata-storage.js';
import { RouteMethod } from '../storage/metadata/route.js';
import { Class } from '../types/class.js';

export function GET (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.GET
    });
  }
}

export function POST (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.POST
    });
  }
}

export function PATCH (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.PATCH
    });
  }
}
export function DELETE (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.DELETE
    });
  }
}

export function OPTIONS (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.OPTIONS
    });
  }
}

export function PUT (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.PUT
    });
  }
}

export function ALL (routeName: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.routes.push({
      target,
      propertyKey,
      routeName,
      method: RouteMethod.ALL
    });
  }
}
