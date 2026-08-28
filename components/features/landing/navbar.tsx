"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { AuthModal } from "@/components/features/auth/auth-modal";
import { useAuth } from "@/lib/context/auth-context";
import { Menu, X, User, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#f4f2eb] border-b border-stone-300">
        <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 text-stone-900">
          <Link href="/" className="flex items-center cursor-pointer">
            <Logo variant="full" height={40} />
          </Link>

          {/* Semua Role Bisa Lihat Katalog */}
          <ul className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-stone-700 uppercase font-mono">
            <li><Link href="/" className="hover:text-[#1d3a28] transition-colors">Beranda</Link></li>
            <li><Link href="/tools" className="hover:text-[#1d3a28] transition-colors">Sewa Alat</Link></li>
            <li><Link href="/guides" className="hover:text-[#1d3a28] transition-colors">Pemandu Wisata</Link></li>
            {user && <li><Link href="/profile" className="hover:text-[#1d3a28] transition-colors">Profil Saya</Link></li>}
            {user?.role === "pemilik" && <li><Link href="/vendor/pemilik" className="text-[#c5922e] hover:underline">Dashboard Toko</Link></li>}
            {user?.role === "pemandu" && <li><Link href="/vendor/pemandu" className="text-[#c5922e] hover:underline">Dashboard Pemandu</Link></li>}
            {user?.role === "admin" && <li><Link href="/admin/dashboard" className="text-rose-700 hover:underline">Admin</Link></li>}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs font-bold text-[#1d3a28] flex items-center gap-1.5 font-mono uppercase">
                  <User className="w-4 h-4" /> {user.name}
                </span>
                <button onClick={logout} className="p-2 border border-stone-300 hover:bg-stone-200 cursor-pointer text-stone-700 rounded-sm" title="Keluar">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="bg-stone-900 hover:bg-[#1d3a28] text-stone-100 px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border border-stone-900 rounded-sm">
                Masuk
              </button>
            )}
            
            {/* Tombol Mobile Menu */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 border border-stone-300 hover:bg-stone-200 transition-colors cursor-pointer rounded-sm">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Dropdown Mobile Menu (Z-Index Tinggi) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 bg-[#f4f2eb] border-b border-stone-300 p-4 font-mono text-xs font-bold uppercase tracking-widest text-stone-800 space-y-2 shadow-xl z-50">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Beranda</Link>
              <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Sewa Alat</Link>
              <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200">Pemandu Wisata</Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-[#1d3a28]">Profil Saya ({user.name})</Link>
                  {user.role === "pemilik" && <Link href="/vendor/pemilik" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-[#c5922e]">Dashboard Toko</Link>}
                  {user.role === "pemandu" && <Link href="/vendor/pemandu" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-[#c5922e]">Dashboard Pemandu</Link>}
                  {user.role === "admin" && <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-stone-200 text-rose-700">Dashboard Admin</Link>}
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-3 text-rose-600">Keluar</button>
                </>
              ) : (
                <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} className="block w-full text-left py-3 text-[#1d3a28]">Masuk / Daftar</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}