"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";

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
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  registeredUsers: UserProfile[]; // Dikembalikan untuk Admin Dashboard
  isLoaded: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (profile: Omit<UserProfile, "id" | "status">, pass: string) => Promise<{ success: boolean; message?: string }>;
  updateAvatar: (avatarUrl: string) => Promise<void>; // Dikembalikan untuk Profile Page
  approveMitra: (userId: string) => Promise<void>; // Dikembalikan untuk Admin Dashboard
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchProfile = async (userId: string, email: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setUser({
        id: data.id,
        name: data.full_name,
        email: email,
        phone: data.phone || "",
        origin: data.origin || "",
        address: data.address || "",
        gender: data.gender || "Laki-laki",
        role: data.role as UserRole,
        status: data.status as AccountStatus || "approved",
        avatar: data.avatar_url || "",
      });
    }
  };

  const fetchAllUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) {
      setRegisteredUsers(data.map((d: any) => ({
        id: d.id, name: d.full_name, email: d.email || "", phone: d.phone || "",
        origin: d.origin || "", address: d.address || "", gender: d.gender || "Laki-laki",
        role: d.role as UserRole, status: d.status as AccountStatus || "approved", avatar: d.avatar_url || ""
      })));
    }
  };

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
        if (session.user.email === "admin@gamtara.com") await fetchAllUsers(); // Admin butuh data semua user
      }
      setIsLoaded(true);
    };
    checkSession();
  }, [supabase]);

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, message: error.message };
    if (data.user) {
      await fetchProfile(data.user.id, data.user.email!);
      if (email === "admin@gamtara.com") await fetchAllUsers();
      return { success: true };
    }
    return { success: false, message: "Terjadi kesalahan saat login." };
  };

  const register = async (profileData: Omit<UserProfile, "id" | "status">, pass: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: profileData.email, password: pass });
    if (authError) return { success: false, message: authError.message };

    if (authData.user) {
      const initialStatus = profileData.role === "customer" ? "approved" : "pending_approval";
      await supabase.from("profiles").insert([{
        id: authData.user.id, email: profileData.email, full_name: profileData.name, phone: profileData.phone,
        origin: profileData.origin, address: profileData.address, gender: profileData.gender, role: profileData.role, status: initialStatus
      }]);
      await fetchProfile(authData.user.id, profileData.email);
      return { success: true, message: "Pendaftaran berhasil!" };
    }
    return { success: false, message: "Terjadi kesalahan saat mendaftar." };
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
    setUser({ ...user, avatar: avatarUrl });
  };

  const approveMitra = async (userId: string) => {
    await supabase.from("profiles").update({ status: "approved" }).eq("id", userId);
    await fetchAllUsers(); // Refresh data admin
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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