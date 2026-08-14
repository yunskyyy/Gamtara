"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Store, Shield, Key } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAuth, UserRole } from "@/lib/context/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [gender, setGender] = React.useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [role, setRole] = React.useState<UserRole>("customer");
  const [errorMsg, setErrorMsg] = React.useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (isLogin) {
      const success = login(email);
      if (!success) {
        setErrorMsg("Email belum terdaftar! Silakan lakukan pendaftaran akun.");
        return;
      }
    } else {
      register({ name, email, phone, origin, address, gender, role });
    }
    onClose();
  };

  const handleQuickDemo = (demoRole: UserRole, demoEmail: string) => {
    login(demoEmail, demoRole);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#f4f2eb] text-stone-900 border border-stone-300 rounded-sm p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-sm bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <Logo variant="full" height={48} className="mx-auto mb-2" />
            <p className="text-xs text-stone-600 font-medium">
              {isLogin ? "Masuk ke Akun Terdaftar GAMTARA" : "Pendaftaran Akun Baru GAMTARA"}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs rounded-sm mb-4 font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {!isLogin && (
              <>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Wisatawan Subur" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor HP / WhatsApp</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Asal</label>
                    <input type="text" required value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Kota Asal" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]">
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. Sulamadaha No. 12" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tipe Pendaftaran</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]">
                    <option value="customer">Wisatawan (Penyewa)</option>
                    <option value="pemilik">Mitra Pemilik Barang</option>
                    <option value="pemandu">Mitra Pemandu Wisata</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Terdaftar</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
            </div>

            <button type="submit" className="w-full py-3 rounded-sm bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md mt-2">
              {isLogin ? "Masuk" : "Daftar Akun"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-300 text-center space-y-2">
            <span className="font-mono text-[10px] text-stone-500 uppercase block font-bold">// DEMO UJI COBA RBAC PERAN</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <button onClick={() => handleQuickDemo("customer", "wisatawan@gamtara.com")} className="p-2 bg-white rounded-sm border border-stone-300 hover:bg-stone-100 flex items-center justify-center gap-1 cursor-pointer">
                <User className="w-3 h-3 text-[#1d3a28]" /> Wisatawan
              </button>
              <button onClick={() => handleQuickDemo("pemilik", "pemilik@gamtara.com")} className="p-2 bg-white rounded-sm border border-stone-300 hover:bg-stone-100 flex items-center justify-center gap-1 cursor-pointer">
                <Store className="w-3 h-3 text-[#1d3a28]" /> Pemilik
              </button>
              <button onClick={() => handleQuickDemo("pemandu", "pemandu@gamtara.com")} className="p-2 bg-white rounded-sm border border-stone-300 hover:bg-stone-100 flex items-center justify-center gap-1 cursor-pointer">
                <Key className="w-3 h-3 text-[#1d3a28]" /> Pemandu
              </button>
              <button onClick={() => handleQuickDemo("admin", "admin@gamtara.com")} className="p-2 bg-white rounded-sm border border-stone-300 hover:bg-stone-100 flex items-center justify-center gap-1 cursor-pointer">
                <Shield className="w-3 h-3 text-rose-700" /> SuperAdmin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}