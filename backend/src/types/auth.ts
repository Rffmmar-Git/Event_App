export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ORGANIZER";
  referral_code?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type UpdateProfileBody = {
  name?: string;
};

export type ChangePasswordBody = {
  current_password: string;
  new_password: string;
};

export type JwtPayload = {
  id: number;
  email: string;
  role: string;
};