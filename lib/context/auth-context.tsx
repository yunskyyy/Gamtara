"use client";

import * as React from "react";

export type UserRole = "customer" | "pemilik" | "pemandu" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string; // Asal
  address: string; // Alamat
  gender: "Laki-laki" | "Perempuan";
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string) => boolean;
  register: (profile: Omit<UserProfile, "id">) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([
    { id: "ADM-1", name: "SuperAdmin Gamtara", email: "admin@gamtara.com", phone: "081234567890", origin: "Ternate", address: "Kantor Pusat Gamtara", gender: "Laki-laki", role: "admin" }
  ]);

  const login = (email: string) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const register = (profileData: Omit<UserProfile, "id">) => {
    const newUser: UserProfile = {
      ...profileData,
      id: `USR-${Date.now().toString().slice(-4)}`,
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
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