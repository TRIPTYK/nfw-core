import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Header (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.header;
  }, 'header');
}
