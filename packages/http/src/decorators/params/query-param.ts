import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function QueryParam (this: unknown, paramName: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.query[paramName];
  }, 'query-param');
}
