import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma";
import { generateReferralCode } from "../utils/referral";

import type { RegisterBody, LoginBody, UpdateProfileBody } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const registerService = async (data: RegisterBody) => {
  const { name, email, password, role, referral_code } = data;

  const existingUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let referrer = null;

  if (referral_code) {
    referrer = await prisma.users.findUnique({
      where: {
        referral_code,
      },
    });

    if (!referrer) {
      throw new Error("Invalid referral code");
    }
  }

  let referralCode = generateReferralCode();

  while (
    await prisma.users.findUnique({
      where: {
        referral_code: referralCode,
      },
    })
  ) {
    referralCode = generateReferralCode();
  }

  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        referral_code: referralCode,
        referred_by_id: referrer?.id ?? null,
      },
    });

    if (referrer) {
      await tx.users.update({
        where: {
          id: referrer.id,
        },
        data: {
          points_balance: {
            increment: 10000,
          },
        },
      });

      const expiredAt = new Date();

      expiredAt.setMonth(expiredAt.getMonth() + 3);

      await tx.coupons.create({
        data: {
          user_id: user.id,
          discount_amount: 25000,
          expired_at: expiredAt,
          is_used: false,
        },
      });
    }

    return user;
  });

  return user;
};

export const loginService = async (data: LoginBody) => {
  const { email, password } = data;

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
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
    },
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

export const updateProfileService = async (
  userId: number,
  data: UpdateProfileBody,
  profilePicture?: string
) => {
  return await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(profilePicture && {
        profile_picture: profilePicture,
      }),
    },
  });
};

export const changePasswordService = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  return await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};