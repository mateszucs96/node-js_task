import { v4 as uuidv4 } from 'uuid';
import { Hobbies, User } from '../types/user';
import { users } from '../data/users';

type UserData = Omit<User, 'id'>;
let USERS = [...users];

export const createUser = (user: UserData) => {
  const newUser: User = { id: uuidv4(), ...user };
  USERS.push(newUser);
  return newUser;
};

export const getUsers = () => [...USERS];

export const deleteUser = (id: string) => {
  const originalLength = USERS.length;
  USERS = USERS.filter((user) => user.id !== id);
  return USERS.length < originalLength;
};

export const getHobbiesForUser = (id: string) => {
  const user = USERS.find((u) => u.id === id);

  return user ? user.hobbies || [] : null;
};

// eslint-disable-next-line consistent-return
export const updateUserHobbies = (id: string, hobbies: Hobbies) => {
  const user = USERS.find((u) => u.id === id);
  if (!user) return false;

  const currentHobbies = user.hobbies ?? [];

  const updatedHobbies = [...new Set([...currentHobbies, ...hobbies])];

  user.hobbies = updatedHobbies;
  return true;
};
