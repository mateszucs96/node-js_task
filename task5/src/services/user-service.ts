import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';
import { users } from '../data/users';
import { validateUser } from '../test/helpers';

type UserData = Omit<User, 'id'>;
let USERS = [...users];

export const createUser = (user: UserData) => {
  const newUser: User = { id: uuidv4(), ...user };
  USERS.push(newUser);
  return newUser;
};

export const getUsers = () => USERS.map((user) => user);

export const deleteUser = (id: string) => {
  const originalLength = USERS.length;
  USERS = USERS.filter((user) => user.id !== id);
  return USERS.length < originalLength;
};
