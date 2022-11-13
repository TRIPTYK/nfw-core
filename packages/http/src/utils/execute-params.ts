import type { RouterContext } from '@koa/router';
import type { ExecutableParam } from '../routing/executable-param.js';

export function executeParams (params: ExecutableParam[], ctx: RouterContext) {
  return Promise.all(params.map((p) => p.execute(ctx)));
}
