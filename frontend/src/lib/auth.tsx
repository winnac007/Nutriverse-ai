"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  clearUserSession,
  persistUserSession,
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from "./api";
import api from "./api";
import { User } from "./types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<User>;
}

const AuthCtx = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSession = typeof window !== "undefined"
      ? Boolean(localStorage.getItem(USER_ACCESS_TOKEN_KEY) || localStorage.getItem(USER_REFRESH_TOKEN_KEY))
      : false;
    if (!hasSession) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => {
        clearUserSession();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistUserSession(data);
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    persistUserSession(data);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
  };

  const refresh = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
    return data;
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, login, register, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
