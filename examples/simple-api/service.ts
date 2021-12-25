import { singleton } from 'tsyringe';

export interface User {
    name: string,
}

let users : User[] = [
  {
    name: 'Amaury'
  },
  {
    name: 'Gilles'
  }
];

@singleton()
export class UsersService {
  addUser (user: User) {
    users.push(user);
    return user;
  }

  removeUser (name: string) {
    users = users.filter((e) => e.name === name);
  }

  updateUser (name: string, body: Partial<User>) {
    const idx = users.findIndex((e) => e.name === name);

    if (idx === -1) {
      throw new Error('User not found');
    }

    return users[idx] = { ...users[idx], ...body };
  }

  getUser (name: string) {
    return users.find((e) => e.name === name);
  }

  getUsers () {
    return users;
  }
}
