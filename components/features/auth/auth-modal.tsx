"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, ShieldCheck, Store } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [role, setRole] = React.useState<"customer" | "vendor">("customer");
  const [isLogin, setIsLogin] = React.useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#f4f2eb] text-stone-900 border border-stone-300 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <Logo variant="full" height={52} className="mx-auto mb-3" />
            <p className="text-xs text-stone-600 font-medium">
              {isLogin ? "Masuk ke akun GAMTARA Anda" : "Daftar akun baru GAMTARA"}
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/80 rounded-xl mb-6 font-semibold text-xs">
            <button
              onClick={() => setRole("customer")}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${role === "customer" ? "bg-[#1d3a28] text-white shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
            >
              <User className="w-3.5 h-3.5" /> Wisatawan
            </button>
            <button
              onClick={() => setRole("vendor")}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${role === "vendor" ? "bg-[#1d3a28] text-white shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
            >
              <Store className="w-3.5 h-3.5" /> Mitra Vendor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); alert(`Login sebagai ${role} berhasil!`); onClose(); }} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Email</label>
              <input type="email" required placeholder="nama@email.com" className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Kata Sandi</label>
              <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#1d3a28]" />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md">
              {isLogin ? "Masuk Sekarang" : "Daftar Sekarang"}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-stone-300 text-xs text-stone-600">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#1d3a28] hover:underline cursor-pointer">
              {isLogin ? "Daftar Akun" : "Masuk"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
