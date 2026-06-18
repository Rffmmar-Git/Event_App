import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma";

import type {
  RegisterBody,
  LoginBody,
} from "../types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "fallback-secret";

export const registerService = async (
  data: RegisterBody
) => {
  const {
    name,
    email,
    password,
    role,
  } = data;

  const existingUser =
    await prisma.users.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "Email already registered"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const referralCode =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const user =
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        referral_code: referralCode,
      },
    });

  return user;
};

export const loginService = async (
  data: LoginBody
) => {
  const {
    email,
    password,
  } = data;

  const user =
    await prisma.users.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};