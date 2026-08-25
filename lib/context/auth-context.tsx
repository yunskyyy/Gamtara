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
  isLoaded: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (profile: Omit<UserProfile, "id" | "status">) => { success: boolean; message?: string };
  updateAvatar: (avatarUrl: string) => void;
  approveMitra: (userId: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([
    { id: "ADM-1", name: "SuperAdmin", email: "admin@gamtara.com", phone: "0811", origin: "Ternate", address: "Pusat", gender: "Laki-laki", role: "admin", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
    { id: "VEN-1", name: "Toko Gamalama Outdoor", email: "gamalama.outdoor@gamtara.com", phone: "0812", origin: "Ternate", address: "Tengah", gender: "Laki-laki", role: "pemilik", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
    { id: "GUI-1", name: "Fikri Subur", email: "fikri.guide@gamtara.com", phone: "0813", origin: "Ternate", address: "Sulamadaha", gender: "Laki-laki", role: "pemandu", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop" },
    { id: "CUS-1", name: "Wisatawan Subur", email: "wisatawan@gamtara.com", phone: "0814", origin: "Jakarta", address: "Hotel", gender: "Laki-laki", role: "customer", status: "approved", password: "password123", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" }
  ]);

  // Load Persistent Auth
  React.useEffect(() => {
    const storedUser = localStorage.getItem("gamtara_user");
    const storedReg = localStorage.getItem("gamtara_reg_users");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedReg) setRegisteredUsers(JSON.parse(storedReg));
    setIsLoaded(true);
  }, []);

  // Simpan jika ada perubahan Register Users
  React.useEffect(() => {
    if (isLoaded) localStorage.setItem("gamtara_reg_users", JSON.stringify(registeredUsers));
  }, [registeredUsers, isLoaded]);

  const login = (email: string, pass: string) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (!found) return { success: false, message: "Email atau kata sandi salah!" };
    if (found.status === "pending_approval") return { success: false, message: "Akun Mitra Anda menunggu verifikasi Admin!" };
    
    setUser(found);
    localStorage.setItem("gamtara_user", JSON.stringify(found));
    return { success: true };
  };

  const register = (profileData: Omit<UserProfile, "id" | "status">) => {
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === profileData.email.toLowerCase());
    if (exists) return { success: false, message: "Email sudah terdaftar!" };

    const initialStatus: AccountStatus = profileData.role === "customer" ? "approved" : "pending_approval";
    const newUser: UserProfile = { ...profileData, id: `USR-${Date.now()}`, status: initialStatus, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" };
    
    setRegisteredUsers((prev) => [...prev, newUser]);
    if (initialStatus === "approved") {
      setUser(newUser);
      localStorage.setItem("gamtara_user", JSON.stringify(newUser));
    }
    return { success: true, message: initialStatus === "pending_approval" ? "Pendaftaran Mitra Berhasil! Tunggu verifikasi Admin." : undefined };
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    const updated = { ...user, avatar: avatarUrl };
    setUser(updated);
    localStorage.setItem("gamtara_user", JSON.stringify(updated));
    setRegisteredUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const approveMitra = (userId: string) => {
    setRegisteredUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "approved" } : u)));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gamtara_user");
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, isLoaded, login, register, updateAvatar, approveMitra, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}