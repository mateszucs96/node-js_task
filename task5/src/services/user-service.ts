import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';
import { users } from '../data/users';

type UserData = Omit<User, 'id'>;
const USERS = [...users];

export const createUser = (user: UserData) => {
  const newUser: User = { id: uuidv4(), ...user };
  USERS.push(newUser);
  return newUser;
};
