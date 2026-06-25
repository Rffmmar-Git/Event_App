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
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

/* REGISTER */
export const register = async (
  payload: RegisterPayload
) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

/* GET CURRENT USER */
export const getMe = async (
  token: string
): Promise<MeResponse> => {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Unauthorized");
  }

  return data;
};

/* UPDATE PROFILE */
export const updateProfile = async (
  formData: FormData
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to update profile"
    );
  }

  return data;
};

/* CHANGE PASSWORD */
export const changePassword = async (
  current_password: string,
  new_password: string
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password,
        new_password,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to change password"
    );
  }

  return data;
};