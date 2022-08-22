import type { RouterContext } from '@koa/router';
import type { JsonApiContext } from '../../../interfaces/json-api-context.js';
import type { ControllerActionParamsMetadataArgs } from '../../../storage/metadata/controller-params.metadata.js';

export function getRouteParamsFromContext (routeParams: ControllerActionParamsMetadataArgs[], ctx: RouterContext, jsonApiContext: JsonApiContext<any>, serviceResponse?: unknown) {
  return routeParams.map((rp) => {
    if (rp.decoratorName === 'koa-context') {
      return ctx;
    }

    if (rp.decoratorName === 'jsonapi-context') {
      return jsonApiContext;
    }

    if (rp.decoratorName === 'service-response') {
      return serviceResponse;
    }

    throw new Error(`Unknown decorator ${rp.decoratorName}`);
  })
}
