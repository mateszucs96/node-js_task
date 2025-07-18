import { User } from '../types/user';

export const buildUserResponse = (user: User) => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  links: {
    self: `/api/users/${user.id}`,
    hobbies: `/api/users/${user.id}/hobbies`,
  },
});
