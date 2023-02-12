import type { ResourceSchema } from '@triptyk/nfw-resources';
import type { User } from '../services/users.js';

export const userResourceSchema : ResourceSchema<User> = {
  validator: {
    isFieldValid (key, newValue, validator) {
      return true;
    }
  },
  structure: {
    name: {
      type: 'string'
    }
  },
  authorization: {
    authorizer: {
      canAccessField (resource, field, value, actor) {
        return true;
      },
      canCreate (actor) {
        return true;
      },
      canDelete (resource, actor) {
        return true;
      },
      canUpdateField (resource, field, newValue) {
        return true;
      }
    }
  }
};
