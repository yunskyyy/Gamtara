"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Toast, ToastType } from "@/components/ui/toast";

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
  registeredUsers: UserProfile[];
  isLoaded: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (profile: any, pass: string) => Promise<boolean>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  approveMitra: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = React.useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Toast State
  const [toastMsg, setToastMsg] = React.useState("");
  const [toastType, setToastType] = React.useState<ToastType>("info");
  const [isToastVisible, setIsToastVisible] = React.useState(false);

  const showToast = (msg: string, type: ToastType) => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastVisible(true);
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  const fetchProfile = async (userId: string, email: string) => {
    if (!supabaseUrl) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setUser({
        id: data.id, name: data.full_name, email: email, phone: data.phone || "",
        origin: data.origin || "", address: data.address || "", gender: data.gender || "Laki-laki",
        role: data.role as UserRole, status: data.status as AccountStatus || "approved", avatar: data.avatar_url || "",
      });
    }
  };

  const fetchAllUsers = async () => {
    if (!supabaseUrl) return;
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
    if (!supabaseUrl) { setIsLoaded(true); return; }
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
        if (session.user.email === "admin@gamtara.com") await fetchAllUsers();
      }
      setIsLoaded(true);
    };
    checkSession();
  }, [supabase, supabaseUrl]);

  const login = async (email: string, pass: string) => {
    if (!supabaseUrl) { showToast("Koneksi Database Belum Diatur", "error"); return false; }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) { showToast(error.message, "error"); return false; }
    if (data.user) {
      await fetchProfile(data.user.id, data.user.email!);
      if (email === "admin@gamtara.com") await fetchAllUsers();
      showToast("Berhasil Masuk!", "success");
      return true;
    }
    return false;
  };

  const register = async (profileData: any, pass: string) => {
    if (!supabaseUrl) { showToast("Koneksi Database Belum Diatur", "error"); return false; }
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: profileData.email, password: pass });
    if (authError) { showToast(authError.message, "error"); return false; }

    if (authData.user) {
      const initialStatus = profileData.role === "customer" ? "approved" : "pending_approval";
      await supabase.from("profiles").insert([{
        id: authData.user.id, email: profileData.email, full_name: profileData.name, phone: profileData.phone,
        origin: profileData.origin, address: profileData.address, gender: profileData.gender, role: profileData.role, status: initialStatus
      }]);

      if (profileData.role === "pemilik") {
        await supabase.from("vendors").insert([{ profile_id: authData.user.id, vendor_type: "tool_provider", business_name: profileData.businessName, location: profileData.origin }]);
      }
      if (profileData.role === "pemandu") {
        const { data: vendorData } = await supabase.from("vendors").insert([{ profile_id: authData.user.id, vendor_type: "tour_guide", business_name: profileData.name, location: profileData.origin }]).select("id").single();
        if (vendorData) {
          await supabase.from("guide_profiles").insert([{ vendor_id: vendorData.id, full_name: profileData.name, languages: profileData.languages, specialty_spots: [profileData.origin], rate_per_day: 150000, avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" }]);
        }
      }

      await fetchProfile(authData.user.id, profileData.email);
      showToast(initialStatus === "pending_approval" ? "Pendaftaran Mitra Berhasil! Tunggu verifikasi Admin." : "Pendaftaran Berhasil!", "success");
      return true;
    }
    return false;
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user || !supabaseUrl) return;
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
    setUser({ ...user, avatar: avatarUrl });
    showToast("Foto profil diperbarui!", "success");
  };

  const approveMitra = async (userId: string) => {
    if (!supabaseUrl) return;
    await supabase.from("profiles").update({ status: "approved" }).eq("id", userId);
    await fetchAllUsers();
    showToast("Mitra berhasil disetujui!", "success");
  };

  const logout = async () => {
    if (!supabaseUrl) return;
    await supabase.auth.signOut();
    setUser(null);
    showToast("Berhasil Keluar", "info");
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, isLoaded, login, register, updateAvatar, approveMitra, logout }}>
      {children}
      <Toast message={toastMsg} type={toastType} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}