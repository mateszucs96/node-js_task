export type Hobbies = string[];

export type User = {
  id: string;
  name: string;
  email: string;
  hobbies: Hobbies;
};

export type UserResponse = {
  user: Omit<User, 'hobbies'>;
  links: {
    self: string;
    hobbies: string;
  };
};

export type UsersResponse = {
  data: UserResponse[];
  error: string | null;
};

export type HobbiesResponse = {
  hobbies: Hobbies;
  links: {
    self: string;
    user: string;
  };
};

export type UserPartial = Pick<User, 'name' | 'email'>;
