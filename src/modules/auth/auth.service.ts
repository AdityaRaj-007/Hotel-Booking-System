import * as authTypes from "./auth.types";
import * as authRepository from "./auth.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
}) => {
  const existingUser = await authRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new Error("Existing user");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await authRepository.createUser(
    payload.name,
    payload.email,
    hashedPassword,
    payload.role,
    payload.phone,
  );

  return user;
};

export const login = async (payload: { email: string; password: string }) => {
  const existingUser = await authRepository.findUserByEmail(payload.email);

  if (!existingUser) {
    throw new Error("User doesn't exists");
  }

  const passwordMatch = await bcrypt.compare(
    payload.password,
    existingUser.password,
  );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    JWT_SECRET,
  );

  return { existingUser, token };
};
