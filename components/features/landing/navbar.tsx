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

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-4 px-4 pointer-events-none"
      >
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 sm:px-8 py-1 bg-[#f4f2eb]/95 backdrop-blur-md border border-stone-300/80 rounded-sm shadow-md text-stone-900">
          
          <Link href="/" className="flex items-center cursor-pointer py-0.5">
            <Logo variant="full" height={48} />
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-stone-700 uppercase">
            <li><Link href="/" className="hover:text-[#1d3a28] transition-colors">Beranda</Link></li>
            <li><Link href="/tools" className="hover:text-[#1d3a28] transition-colors">Sewa Alat</Link></li>
            <li><Link href="/guides" className="hover:text-[#1d3a28] transition-colors">Pemandu Wisata</Link></li>
            <li>
              <Link href="/profile" onClick={handleProfileClick} className="hover:text-[#1d3a28] transition-colors flex items-center gap-1 font-extrabold text-[#1d3a28]">
                <User className="w-3.5 h-3.5" /> Profil Saya
              </Link>
            </li>
            {user?.role === "admin" && (
              <li><Link href="/admin/dashboard" className="text-rose-700 font-extrabold hover:underline">Admin</Link></li>
            )}
            {(user?.role === "pemilik" || user?.role === "pemandu") && (
              <li><Link href="/vendor/dashboard" className="text-[#1d3a28] font-extrabold hover:underline">Mitra</Link></li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="text-xs font-bold text-[#1d3a28] bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer">
                  <User className="w-3.5 h-3.5" /> {user.name}
                </Link>
                <button onClick={logout} className="p-2 bg-stone-200 hover:bg-stone-300 rounded-sm cursor-pointer text-stone-700" title="Keluar">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="bg-[#1d3a28] hover:bg-[#152a1b] text-stone-100 px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm">
                Masuk
              </button>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-sm bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors cursor-pointer">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div className="pointer-events-auto md:hidden w-full max-w-5xl mt-2 bg-[#f4f2eb] border border-stone-300 rounded-sm p-4 shadow-xl text-xs font-bold uppercase tracking-wider text-stone-800 space-y-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Beranda</Link>
              <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Sewa Alat</Link>
              <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Pemandu Wisata</Link>
              <Link href="/profile" onClick={(e) => { setIsMobileMenuOpen(false); handleProfileClick(e); }} className="block py-2 px-3 rounded-sm bg-emerald-100 text-[#1d3a28]">
                Profil Saya {user ? `(${user.name})` : ""}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}