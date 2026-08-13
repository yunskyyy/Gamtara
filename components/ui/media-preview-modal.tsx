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
  const { selectedTools, selectedGuide, toggleTool, selectGuide } = useBooking();

  if (!data) return null;

  const isTool = data.type === "tool";
  const isToolSelected = isTool && selectedTools.some((t) => t.id === data.id);
  const isGuideSelected = !isTool && selectedGuide?.id === data.id;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#f4f2eb] text-stone-900 border border-stone-300 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Foto HD Jelas */}
            <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shadow-sm">
              <img
                src={data.img}
                alt={data.name}
                className={`w-full h-full object-cover ${!isTool ? "object-top" : ""}`}
              />
            </div>

            {/* Rincian Profil / Alat */}
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#c5922e] uppercase block mb-1">
                  {isTool ? `ALAT SEWA • ${data.categoryOrLang}` : `TOUR GUIDE LOKAL • ${data.rating}★`}
                </span>

                <h2 className="text-2xl font-extrabold text-stone-900 mb-2">{data.name}</h2>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                  {data.desc || (isTool ? "Peralatan teruji standar keselamatan outdoor untuk kenyamanan petualangan Anda di Ternate." : "Tour Guide lokal berpengalaman bersertifikat, siap mendampingi perjalanan eksplorasi Anda secara aman.")}
                </p>

                <p className="text-[#1d3a28] font-extrabold text-lg font-mono mb-6">
                  Rp {data.price.toLocaleString("id-ID")} <span className="text-xs text-stone-500 font-normal">/ hari</span>
                </p>
              </div>

              {/* Tombol Pilih Langsung di Modal Preview */}
              {isTool ? (
                <button
                  onClick={() => {
                    toggleTool({ id: data.id, name: data.name, price: data.price, img: data.img });
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isToolSelected ? "bg-[#1d3a28] text-white" : "bg-stone-900 text-white hover:bg-[#1d3a28]"
                  }`}
                >
                  {isToolSelected ? <><Check className="w-4 h-4" /> Terpilih Dalam Keranjang</> : "Pilih Alat Ini"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    selectGuide({ id: data.id, name: data.name, price: data.price, avatar: data.img });
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isGuideSelected ? "bg-[#1d3a28] text-white" : "bg-stone-900 text-white hover:bg-[#1d3a28]"
                  }`}
                >
                  {isGuideSelected ? <><Check className="w-4 h-4" /> Guide Terpilih</> : "Pilih Tour Guide Ini"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
