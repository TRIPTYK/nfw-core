/* eslint-disable max-statements */
import type { JsonApiContext } from '../../../interfaces/json-api-context.js';
import type { Resource } from '../../../resource/base.resource.js';
import type { ControllerActionParamsMetadataArgs } from '../../../storage/metadata/controller-params.metadata.js';

export function getRouteParamsFromContext (routeParams: ControllerActionParamsMetadataArgs[], jsonApiContext: JsonApiContext<any>, body: Resource<any> | undefined) {
  return routeParams.map((rp) => {
    if (rp.decoratorName === 'koa-context') {
      return jsonApiContext.koaContext;
    }

    if (rp.decoratorName === 'jsonapi-context') {
      return jsonApiContext;
    }

    if (rp.decoratorName === 'body-as-resource') {
      return body;
    }

    throw new Error(`Unknown decorator ${rp.decoratorName}`);
  });
}
