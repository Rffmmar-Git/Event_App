export interface User {
  id: number;
  name?: string;
  email: string;
  role: string;

  points_balance: number;
  referral_code?: string;
  profile_picture?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;

  referral_code?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface MeResponse {
  success: boolean;
  user: User;
}