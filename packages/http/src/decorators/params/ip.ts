import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Ip (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, 'ip');
}
