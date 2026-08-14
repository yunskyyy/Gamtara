"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ArrowRight } from "lucide-react";

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  actionText?: string;
}

export function AuthPromptModal({ isOpen, onClose, onOpenAuth, actionText = "memilih layanan" }: AuthPromptProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-[#f4f2eb] text-stone-900 border border-stone-300 rounded-sm p-6 shadow-2xl text-center font-sans"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-sm bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-sm bg-[#1d3a28]/10 text-[#1d3a28] flex items-center justify-center mx-auto mb-4 border border-[#1d3a28]/20">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-extrabold text-lg text-stone-900 mb-2">Akses Diperlukan</h3>

          <p className="text-xs text-stone-600 leading-relaxed mb-6">
            Silakan Masuk atau Daftar akun GAMTARA terlebih dahulu untuk {actionText}.
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-sm bg-stone-200 text-stone-800 hover:bg-stone-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex-1 py-2.5 rounded-sm bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Masuk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}