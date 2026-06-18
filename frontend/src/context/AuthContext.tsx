import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginService,
  getMe,
} from "../services/authService";

import type {
  User,
  LoginPayload,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    payload: LoginPayload
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const restoreUser =
      async () => {
        try {
          const storedToken =
            localStorage.getItem(
              "token"
            );

          if (!storedToken) {
            setLoading(false);
            return;
          }

          const response =
            await getMe(
              storedToken
            );

          setUser(
            response.user
          );
        } catch {
          localStorage.removeItem(
            "token"
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreUser();
  }, []);

  const login = async (
    payload: LoginPayload
  ) => {
    const response =
      await loginService(
        payload
      );

    const token =
      response.data.token;

    const user =
      response.data.user;

    localStorage.setItem(
      "token",
      token
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};