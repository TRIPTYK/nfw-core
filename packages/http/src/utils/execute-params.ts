import type { RouterContext } from '@koa/router';
import type { ExecutableParam } from '../executables/executable-param.js';

export async function executeParams (params: ExecutableParam[], ctx: RouterContext) {
  const p = params.map(async (p) => p.execute(ctx));
  return Promise.all(p);
}
