"use client";

import * as React from "react";

export type UserRole = "customer" | "pemilik" | "pemandu" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, phone: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);

  const login = (email: string, targetRole: UserRole = "customer") => {
    setUser({
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split("@")[0].toUpperCase(),
      email: email,
      phone: "081234567890",
      role: targetRole,
    });
    return true;
  };

  const register = (name: string, email: string, phone: string, role: UserRole) => {
    setUser({
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}