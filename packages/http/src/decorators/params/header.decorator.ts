import { createCustomDecorator } from '../../factories/custom-decorator.factory.js';

export function Header (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.header;
  }, 'header', false);
}
