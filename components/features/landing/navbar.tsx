"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { AuthModal } from "@/components/features/auth/auth-modal";
import { useAuth } from "@/lib/context/auth-context";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isAdmin = user?.role === "admin";

  // Fungsi untuk mengambil inisial nama (Misal: "Wisatawan Subur" -> "WS")
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <>
      <motion.header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-4 px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 sm:px-8 py-1 bg-[#f4f2eb]/95 backdrop-blur-md border border-stone-300/80 rounded-none shadow-md text-stone-900">
          
          <Link href="/" className="flex items-center cursor-pointer py-0.5">
            <Logo variant="full" height={48} />
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-stone-700 uppercase font-mono">
            <li><Link href="/" className="hover:text-[#1d3a28] transition-colors">Beranda</Link></li>
            {!isAdmin && (
              <>
                <li><Link href="/tools" className="hover:text-[#1d3a28] transition-colors">Sewa Alat</Link></li>
                <li><Link href="/guides" className="hover:text-[#1d3a28] transition-colors">Pemandu Wisata</Link></li>
              </>
            )}
            {user?.role === "pemilik" && <li><Link href="/vendor/pemilik" className="text-[#c5922e] hover:underline">Dashboard Toko</Link></li>}
            {user?.role === "pemandu" && <li><Link href="/vendor/pemandu" className="text-[#c5922e] hover:underline">Dashboard Pemandu</Link></li>}
            {isAdmin && <li><Link href="/admin/dashboard" className="text-rose-700 hover:underline">Dashboard Admin</Link></li>}
          </ul>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center">
                <Link href="/profile" className="w-9 h-9 rounded-none overflow-hidden border-2 border-stone-300 hover:border-[#1d3a28] transition-colors cursor-pointer shadow-sm bg-stone-200 flex items-center justify-center text-[#1d3a28] font-bold text-xs">
                  {user.avatar ? <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" /> : getInitials(user.name)}
                </Link>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="bg-[#1d3a28] hover:bg-[#152a1b] text-stone-100 px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm">
                Masuk
              </button>
            )}
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 border border-stone-300 hover:bg-stone-200 transition-colors cursor-pointer rounded-none">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 bg-[#f4f2eb] border-b border-stone-300 p-4 font-mono text-xs font-bold uppercase tracking-widest text-stone-800 space-y-2 shadow-xl z-50 pointer-events-auto">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Beranda</Link>
              {!isAdmin && (
                <>
                  <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Sewa Alat</Link>
                  <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Pemandu Wisata</Link>
                </>
              )}
              {user?.role === "pemilik" && <Link href="/vendor/pemilik" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-[#c5922e]">Dashboard Toko</Link>}
              {user?.role === "pemandu" && <Link href="/vendor/pemandu" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-[#c5922e]">Dashboard Pemandu</Link>}
              {isAdmin && <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-rose-700">Dashboard Admin</Link>}
              
              {user ? (
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[#1d3a28] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-none bg-stone-200 flex items-center justify-center text-[8px] font-bold border border-stone-300">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user.name)}
                  </div>
                  Profil Saya
                </Link>
              ) : (
                <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} className="block w-full text-left py-3 text-[#1d3a28]">Masuk / Daftar</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}