import express from "express";
import fsp from "fs/promises";
import { randomUUID } from "crypto";
import { json } from "body-parser";
import cors from "cors";

export type User = {
  id: string;
  gender: "MALE" | "FEMALE";
  firstName: string;
  lastName: string;
  age: number;
};

type UserJSON = {
  gender: "MALE" | "FEMALE";
  firstName: string;
  lastName: string;
  age: string;
};

const app = express().use(json()).use(cors());

const validateUser = (user: Partial<UserJSON>): boolean => {
  const ACCEPTED_FIELDS: (keyof UserJSON)[] = [
    "age",
    "gender",
    "firstName",
    "lastName",
  ];
  const hasInvalidField = Object.keys(user).some(
    (key) => !ACCEPTED_FIELDS.includes(key as keyof UserJSON)
  );
  return !hasInvalidField;
};

const getUsers = async (): Promise<User[]> => {
  const users = JSON.parse(
    await fsp.readFile("users.json", "utf-8").catch((err) => {
      console.error(err);
      return "[]";
    })
  );
  return users;
};

const setUsers = (users: User[]) =>
  fsp.writeFile("users.json", JSON.stringify(users));

const addUser = async (user: UserJSON) => {
  const isValidUser = validateUser(user);
  if (!isValidUser) throw new Error("Not a valid user");
  const users = await getUsers();
  await setUsers([
    ...users,
    { ...user, id: randomUUID(), age: parseInt(user.age) },
  ]);
};

const getUser = async (id: string): Promise<User | undefined> => {
  const users = await getUsers();
  return users.find((user) => user.id === id);
};

const updateUser = async (id: string, updatedFields: Partial<UserJSON>) => {
  const isValidUser = validateUser(updatedFields);
  if (!isValidUser) throw new Error("Invalid field provided");

  const users = await getUsers();
  const updatedUsers = users.map((user) => {
    if (user.id !== id) return user;
    return {
      ...user,
      ...updatedFields,
      age: updatedFields?.age ? parseInt(updatedFields?.age) : user.age,
    };
  });
  await setUsers(updatedUsers);
};

const removeUser = async (id: string) => {
  const users = await getUsers();
  const updatedUsers = users.filter((user) => user.id !== id);
  await setUsers(updatedUsers);
};

app.get("/api/users", async (_, res) => {
  const users = await getUsers();
  res.send(users);
});

app.post("/api/users", async (req, res) => {
  const user: UserJSON = req.body;
  await addUser(user).catch((err) => {
    res.status(400).send(err.message);
    return;
  });
  res.status(201).send(user);
});

app.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  res.send(user);
});

app.patch("/api/users/:id", async (req, res) => {
  const updatedUser: Partial<UserJSON> = req.body;
  const id = req.params.id;
  await updateUser(id, updatedUser).catch((err) => {
    res.status(400).send(err.message);
    return;
  });
  res.status(204).send();
});

app.delete("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  await removeUser(id);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
