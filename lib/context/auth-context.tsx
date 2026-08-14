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
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, targetRole?: UserRole) => boolean;
  register: (profile: Omit<UserProfile, "id">) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([
    { id: "ADM-1", name: "SuperAdmin Gamtara", email: "admin@gamtara.com", phone: "081234567890", origin: "Ternate", address: "Kantor Pusat", gender: "Laki-laki", role: "admin" },
    { id: "CUS-1", name: "Wisatawan Subur", email: "wisatawan@gamtara.com", phone: "081111111111", origin: "Jakarta", address: "Hotel Ternate", gender: "Laki-laki", role: "customer" },
    { id: "VEN-1", name: "Toko Gamalama", email: "pemilik@gamtara.com", phone: "082222222222", origin: "Ternate", address: "Jl. Gamalama", gender: "Laki-laki", role: "pemilik" },
    { id: "GUI-1", name: "Usman Gamalama", email: "pemandu@gamtara.com", phone: "083333333333", origin: "Ternate", address: "Jl. Gunung", gender: "Laki-laki", role: "pemandu" }
  ]);

  const login = (email: string, targetRole?: UserRole) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      // Jika targetRole dikirim (dari tombol demo), paksa ubah role-nya untuk keperluan demo
      if (targetRole) {
        setUser({ ...found, role: targetRole });
      } else {
        setUser(found);
      }
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