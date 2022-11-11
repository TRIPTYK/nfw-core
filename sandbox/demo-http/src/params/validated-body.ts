import type { ControllerParamsContext } from '@triptyk/nfw-http';
import { createCustomDecorator } from '@triptyk/nfw-http';
import type { ObjectSchema } from 'yup';

export const validatedBody = async (schema: ObjectSchema<any>, context: ControllerParamsContext) => {
  return schema.validate(context.ctx.request.body);
};

export function ValidatedBody (schema: ObjectSchema<any>) {
  return createCustomDecorator((context) => validatedBody(schema, context), 'validated-body');
}
