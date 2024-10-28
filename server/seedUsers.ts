import { User } from ".";
import fsp from "fs/promises";
import { randomUUID } from "crypto";

const generateUser = (): User => ({
  id: randomUUID(),
  gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
  firstName: Math.random().toString(36).substring(7),
  lastName: Math.random().toString(36).substring(7),
  age: Math.floor(Math.random() * 80) + 18,
});

const generateUsers = (count: number): User[] =>
  Array.from({ length: count }, generateUser);

(async () => {
  const count = parseInt(process?.argv?.[2] ?? 10);
  console.log(`Generating ${count} users...`);
  const mockUsers = generateUsers(count);
  await fsp.writeFile("./users.json", JSON.stringify(mockUsers));
  console.log("Generated users");
})();
