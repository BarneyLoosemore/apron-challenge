import { UserSchema } from "../../components/UserForm";

const USERS_API = "http://localhost:3000/api/users";

export type User = {
  id: string;
  gender: "MALE" | "FEMALE";
  firstName: string;
  lastName: string;
  age: number;
};

export const fetchUsers = (): Promise<User[]> =>
  fetch(USERS_API).then((response) => response.json());

export const addUser = (user: UserSchema): Promise<User> =>
  fetch(USERS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((response) => response.json());

export const updateUser = async (
  user: UserSchema,
  id: string
): Promise<void> => {
  await fetch(`${USERS_API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await fetch(`${USERS_API}/${id}`, {
    method: "DELETE",
  });
};
