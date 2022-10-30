import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Body (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return (ctx.request as any).body ?? ctx.body;
  }, 'body');
}
