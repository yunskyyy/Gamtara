"use client";

import * as React from "react";

export type UserRole = "customer" | "pemilik" | "pemandu" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  address: string;
  gender: "Laki-laki" | "Perempuan";
  role: UserRole;
  password?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (profile: Omit<UserProfile, "id">) => boolean;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([
    {
      id: "ADM-001",
      name: "SuperAdmin GAMTARA",
      email: "admin@gamtara.com",
      phone: "081199998888",
      origin: "Ternate",
      address: "Kantor Pusat GAMTARA",
      gender: "Laki-laki",
      role: "admin",
      password: "password123",
    }
  ]);

  const login = (email: string, pass: string) => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );

    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, message: "Email atau kata sandi tidak cocok!" };
  };

  const register = (profileData: Omit<UserProfile, "id">) => {
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === profileData.email.toLowerCase()
    );
    if (exists) return false;

    const newUser: UserProfile = {
      ...profileData,
      id: `USR-${Date.now().toString().slice(-4)}`,
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return true;
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