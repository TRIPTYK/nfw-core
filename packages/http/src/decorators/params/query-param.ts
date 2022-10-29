import { createCustomDecorator } from '../../factories/custom-decorator.js';

export function QueryParam (this: unknown, paramName: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.query[paramName];
  }, 'query-param');
}
