import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  MeResponse,
} from "../types/auth";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(
    "/events",
    "/auth"
  ) || "http://localhost:5000/auth";

/* LOGIN */
export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message ||
        "Login failed"
    );
  }

  return data;
};

/* REGISTER */
export const register = async (
  payload: RegisterPayload
) => {
  const res = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message ||
        "Registration failed"
    );
  }

  return data;
};

/* GET CURRENT USER */
export const getMe = async (
  token: string
): Promise<MeResponse> => {
  const res = await fetch(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message ||
        "Unauthorized"
    );
  }

  return data;
};