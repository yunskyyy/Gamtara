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
  isLoaded: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (profile: Omit<UserProfile, "id" | "status">, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Inisialisasi Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fungsi untuk menarik data profil dari tabel 'profiles' berdasarkan User ID
  const fetchProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

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
        status: "approved", // Asumsi approved untuk saat ini
        avatar: data.avatar_url || "",
      });
    }
  };

  // Cek Sesi Aktif saat web pertama kali dimuat
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      }
      setIsLoaded(true);
    };

    checkSession();

    // Listener jika ada perubahan status login (misal login di tab lain)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Fungsi Login Real Supabase
  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      await fetchProfile(data.user.id, data.user.email!);
      return { success: true };
    }
    return { success: false, message: "Terjadi kesalahan saat login." };
  };

  // Fungsi Register Real Supabase (Auth + Insert ke Tabel Profiles)
  const register = async (profileData: Omit<UserProfile, "id" | "status">, pass: string) => {
    // 1. Daftarkan ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: profileData.email,
      password: pass,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    if (authData.user) {
      // 2. Insert data diri ke tabel 'profiles'
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          full_name: profileData.name,
          phone: profileData.phone,
          origin: profileData.origin,
          address: profileData.address,
          gender: profileData.gender,
          role: profileData.role,
        },
      ]);

      if (profileError) {
        return { success: false, message: "Gagal menyimpan data profil: " + profileError.message };
      }

      // Jika berhasil, otomatis login
      await fetchProfile(authData.user.id, profileData.email);
      return { success: true, message: "Pendaftaran berhasil!" };
    }

    return { success: false, message: "Terjadi kesalahan saat mendaftar." };
  };

  // Fungsi Logout Real Supabase
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}