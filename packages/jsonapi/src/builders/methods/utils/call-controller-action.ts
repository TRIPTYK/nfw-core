import type { Constructor } from 'type-fest';
import type { JsonApiContext } from '../../../interfaces/json-api-context.js';
import type { Resource } from '../../../resource/base.resource.js';
import type { ControllerActionParamsMetadataArgs } from '../../../storage/metadata/controller-params.metadata.js';
import { getRouteParamsFromContext } from './evaluate-route-params.js';

// eslint-disable-next-line max-params
export async function callControllerAction<T extends Constructor<any>> (instance: InstanceType<T>, propertyName: keyof T, routeParams: ControllerActionParamsMetadataArgs[], jsonApiContext: JsonApiContext<any, Resource<any>>, bodyAsResource: Resource<any> | undefined) {
  const evaluatedParams = getRouteParamsFromContext(routeParams, jsonApiContext, bodyAsResource);
  return (instance[propertyName] as Function).call(instance, ...evaluatedParams);
}
