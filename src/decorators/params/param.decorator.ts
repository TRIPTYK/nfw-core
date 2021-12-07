import { createCustomDecorator } from '../../index.js';

export function Param (this: unknown, ...params: [string]) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params[params[0]];
  }, 'param', true, [params[0]]);
}
