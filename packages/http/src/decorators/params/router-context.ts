import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Ctx (this: unknown) {
  return createCustomDecorator(({ ctx }) => ctx, 'router-context');
}
