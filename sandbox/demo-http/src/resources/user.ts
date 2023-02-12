import type { ResourceSchema } from '@triptyk/nfw-resources';
import type { UserModel } from '../models/user.model.js';

export const userResourceSchema: ResourceSchema<UserModel> = {
  validator: {
    isFieldValid () {
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
      canAccessField () {
        return true;
      },
      canCreate () {
        return true;
      },
      canDelete () {
        return true;
      },
      canUpdateField () {
        return true;
      }
    }
  }
};
