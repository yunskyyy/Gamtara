"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { AuthModal } from "@/components/features/auth/auth-modal";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <motion.header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pt-4 px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 sm:px-10 py-2 bg-[#f5f3ec]/95 backdrop-blur-md border border-stone-300 rounded-sm shadow-md text-stone-900">
          <Link href="/" className="flex items-center cursor-pointer">
            <Logo variant="full" height={48} />
          </Link>

          <ul className="hidden md:flex items-center gap-8 font-mono text-xs font-bold tracking-widest text-stone-700 uppercase">
            <li><Link href="/" className="hover:text-[#1d3a28] transition-colors">Beranda</Link></li>
            <li><Link href="/tools" className="hover:text-[#1d3a28] transition-colors">Sewa Alat</Link></li>
            <li><Link href="/guides" className="hover:text-[#1d3a28] transition-colors">Tour Guide</Link></li>
          </ul>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsAuthOpen(true)} className="bg-stone-900 hover:bg-[#1d3a28] text-stone-100 px-6 py-2 rounded-sm font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border border-stone-800">
              Masuk
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-sm bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors cursor-pointer border border-stone-300">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pointer-events-auto md:hidden w-full max-w-5xl mt-2 bg-[#f5f3ec] border border-stone-300 rounded-sm p-4 shadow-xl font-mono text-xs font-bold uppercase tracking-widest text-stone-800 space-y-2">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Beranda</Link>
              <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Sewa Alat</Link>
              <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 rounded-sm hover:bg-stone-200">Tour Guide</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
