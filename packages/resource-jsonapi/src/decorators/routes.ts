import { container } from '@triptyk/nfw-core';
import { HttpMethod, MetadataStorage } from '@triptyk/nfw-http';

function addRoute (method: HttpMethod, routeName: string) {
  return function (target: any, propertyName: string | symbol) {
    container.resolve(MetadataStorage).addEndpoint({
      target,
      propertyName: propertyName.toString(),
      method,
      args: {
        routeName,
      },
    });
  };
}

export function JsonApiGet (): MethodDecorator {
  return addRoute(HttpMethod.GET, '/:id');
}

export function JsonApiFindAll (): MethodDecorator {
  return addRoute(HttpMethod.GET, '/');
}

export function JsonApiDelete (): MethodDecorator {
  return addRoute(HttpMethod.DELETE, '/:id');
}

export function JsonApiUpdate (): MethodDecorator {
  return addRoute(HttpMethod.PATCH, '/:id');
}

export function JsonApiCreate (): MethodDecorator {
  return addRoute(HttpMethod.POST, '/:id');
}
