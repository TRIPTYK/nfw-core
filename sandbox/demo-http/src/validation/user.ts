import { object, string } from 'yup';

export const userSchema = object().shape({
  name: string().required()
});
