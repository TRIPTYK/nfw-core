import { createCustomDecorator } from '../../factories/custom-decorator.factory.js'

export function Ctx (this: unknown) {
  return createCustomDecorator(({ ctx }) => ctx, 'router-context', false);
}
