"use client";

import * as React from "react";

export type UserRole = "customer" | "pemilik" | "pemandu" | "admin";
export type AccountStatus = "approved" | "pending_approval";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  address: string;
  gender: "Laki-laki" | "Perempuan";
  role: UserRole;
  status: AccountStatus;
  password?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  registeredUsers: UserProfile[];
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (profile: Omit<UserProfile, "id" | "status">) => { success: boolean; message?: string };
  updateAvatar: (avatarUrl: string) => void;
  approveMitra: (userId: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([
    { id: "ADM-1", name: "SuperAdmin GAMTARA", email: "admin@gamtara.com", phone: "081199998888", origin: "Ternate", address: "Kantor Pusat", gender: "Laki-laki", role: "admin", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
    { id: "VEN-1", name: "Toko Gamalama Outdoor", email: "gamalama.outdoor@gamtara.com", phone: "081234567890", origin: "Ternate", address: "Jl. Gamalama No. 10", gender: "Laki-laki", role: "pemilik", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
    { id: "GUI-1", name: "Fikri Subur", email: "fikri.guide@gamtara.com", phone: "081344556677", origin: "Ternate", address: "Jl. Sulamadaha No. 12", gender: "Laki-laki", role: "pemandu", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop" },
    { id: "CUS-1", name: "Wisatawan Subur", email: "wisatawan@gamtara.com", phone: "081288887777", origin: "Jakarta", address: "Hotel Grand Dafam", gender: "Laki-laki", role: "customer", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" }
  ]);

  const login = (email: string, pass: string) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (!found) return { success: false, message: "Email atau kata sandi tidak cocok!" };
    if (found.status === "pending_approval") return { success: false, message: "Akun Mitra Anda masih menunggu persetujuan SuperAdmin!" };
    setUser(found);
    return { success: true };
  };

  const register = (profileData: Omit<UserProfile, "id" | "status">) => {
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === profileData.email.toLowerCase());
    if (exists) return { success: false, message: "Email sudah terdaftar!" };

    const initialStatus: AccountStatus = profileData.role === "customer" ? "approved" : "pending_approval";
    const newUser: UserProfile = {
      ...profileData,
      id: `USR-${Date.now().toString().slice(-4)}`,
      status: initialStatus,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    if (initialStatus === "approved") setUser(newUser);
    return { success: true, message: initialStatus === "pending_approval" ? "Pendaftaran Mitra Berhasil! Menunggu verifikasi SuperAdmin." : undefined };
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    const updated = { ...user, avatar: avatarUrl };
    setUser(updated);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const approveMitra = (userId: string) => {
    setRegisteredUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "approved" } : u)));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, registeredUsers, login, register, updateAvatar, approveMitra, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}