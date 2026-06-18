export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ORGANIZER";
};

export type LoginBody = {
  email: string;
  password: string;
};

export type JwtPayload = {
  id: number;
  email: string;
  role: string;
};