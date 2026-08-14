"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useBooking } from "@/lib/context/booking-context";

export interface PreviewData {
  type: "tool" | "guide";
  id: string;
  name: string;
  price: number;
  img: string;
  categoryOrLang?: string;
  rating?: string | number;
  desc?: string;
}

interface ModalProps {
  data: PreviewData | null;
  onClose: () => void;
}

export function MediaPreviewModal({ data, onClose }: ModalProps) {
  const { selectedTools, toggleTool } = useBooking();

  if (!data) return null;

  const isTool = data.type === "tool";
  const isToolSelected = isTool && selectedTools.some((t) => t.id === data.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 20 }} 
          className="relative w-full max-w-4xl bg-[#f4f2eb] text-stone-900 shadow-2xl flex flex-col sm:flex-row overflow-hidden border border-stone-300"
        >
          {/* Tombol Tutup Editorial (Tanpa background bulat abu-abu AI) */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer font-mono text-[10px] font-bold tracking-widest uppercase"
          >
            TUTUP <X className="w-4 h-4" />
          </button>

          {/* Kiri: Foto Full-Bleed (Asimetris) */}
          <div className="w-full sm:w-1/2 h-64 sm:h-[480px] bg-stone-200 border-b sm:border-b-0 sm:border-r border-stone-300">
            <img 
              src={data.img} 
              alt={data.name} 
              className={`w-full h-full object-cover grayscale-[10%] ${!isTool ? "object-top" : ""}`} 
            />
          </div>

          {/* Kanan: Konten Editorial dengan Whitespace Lega */}
          <div className="w-full sm:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-[#f9f8f3]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#c5922e] uppercase tracking-widest block mb-3">
                {isTool ? `ALAT SEWA • ${data.categoryOrLang}` : `PEMANDU WISATA • ${data.rating}★`}
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4 leading-tight tracking-tight">
                {data.name}
              </h2>
              
              <p className="text-stone-600 text-sm leading-relaxed mb-8 font-light">
                {data.desc || (isTool ? "Peralatan teruji standar keselamatan outdoor untuk kenyamanan petualangan Anda di Ternate." : "Tour Guide lokal berpengalaman bersertifikat, siap mendampingi perjalanan eksplorasi Anda secara aman.")}
              </p>
              
              <div className="border-t border-stone-300 pt-4 mb-8">
                <span className="text-[10px] text-stone-500 block font-mono uppercase tracking-widest mb-1">Tarif Harian</span>
                <p className="text-[#1d3a28] font-black text-2xl font-mono">
                  Rp {data.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Tombol Pilih (Hanya untuk Alat) */}
            {isTool && (
              <button
                onClick={() => toggleTool({ id: data.id, name: data.name, price: data.price, img: data.img })}
                className={`w-full py-3.5 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 border ${
                  isToolSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-transparent text-stone-900 hover:bg-stone-200 border-stone-900"
                }`}
              >
                {isToolSelected ? <><Check className="w-4 h-4" /> TERPILIH DALAM KERANJANG</> : "PILIH ALAT INI"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}