"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
    const token = typeof window !== "undefined" ? localStorage.getItem("nv_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => {
        if (typeof window !== "undefined") localStorage.removeItem("nv_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (typeof window !== "undefined") localStorage.setItem("nv_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    if (typeof window !== "undefined") localStorage.setItem("nv_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("nv_token");
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
