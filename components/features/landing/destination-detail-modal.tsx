"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, MapPin, Check } from "lucide-react";
import { useBooking } from "@/lib/context/booking-context";
import { DestinationData } from "@/lib/data/mock-tourism-data";

interface ModalProps {
  destination: DestinationData | null;
  onClose: () => void;
}

export function DestinationDetailModal({ destination, onClose }: ModalProps) {
  const { selectedTools, selectedGuide, toggleTool, selectGuide } = useBooking();

  if (!destination) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#f5f3ec] text-stone-900 border border-stone-300 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 rounded-sm bg-stone-900 text-white hover:bg-[#1d3a28] transition-colors cursor-pointer border border-stone-800">
            <X className="w-4 h-4" />
          </button>

          <div className="relative h-64 w-full bg-stone-900 border-b border-stone-300">
            <img src={destination.img} alt={destination.title} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[11px] px-3 py-1 rounded-sm bg-[#1d3a28] text-stone-100 uppercase tracking-widest mb-2 inline-block">
                {destination.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">{destination.title}</h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8 font-sans">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-stone-800">
                <ShieldCheck className="w-4 h-4 text-[#1d3a28]" /> // ALAT SEWA DISARANKAN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(destination.suggestedTools || []).map((tool) => {
                  const isSelected = selectedTools.some((t) => t.id === tool.id);
                  const price = tool.price ?? 0;
                  return (
                    <div key={tool.id} className={`flex items-center gap-4 p-3 rounded-sm border transition-all ${isSelected ? "bg-[#1d3a28]/10 border-[#1d3a28]" : "bg-white border-stone-300"}`}>
                      <img src={tool.img} alt={tool.name} className="w-14 h-14 rounded-sm object-cover border border-stone-300" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-stone-900">{tool.name}</h4>
                        <p className="text-[#1d3a28] font-mono text-xs font-bold mt-0.5">Rp {price.toLocaleString("id-ID")} / hari</p>
                      </div>
                      <button onClick={() => toggleTool({ id: tool.id, name: tool.name, price: price, img: tool.img })} className={`px-3.5 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-stone-900 text-white hover:bg-[#1d3a28] border-stone-900"}`}>
                        {isSelected ? <Check className="w-4 h-4" /> : "Pilih"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-stone-800">
                <MapPin className="w-4 h-4 text-[#1d3a28]" /> // TOUR GUIDE LOKAL TERDAFTAR
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(destination.guides || []).map((guide) => {
                  const isSelected = selectedGuide?.id === guide.id;
                  const isAvailable = guide.status === "available" || guide.status === "Tersedia";
                  const guidePrice = guide.price ?? 150000;

                  return (
                    <div key={guide.id} onClick={() => isAvailable && selectGuide({ id: guide.id, name: guide.name, price: guidePrice, avatar: guide.avatar })} className={`flex items-center justify-between p-4 rounded-sm border transition-all ${!isAvailable ? "opacity-50 cursor-not-allowed bg-stone-200/50 border-stone-300" : "cursor-pointer hover:border-[#1d3a28]"} ${isSelected ? "bg-[#1d3a28]/10 border-[#1d3a28]" : "bg-white border-stone-300"}`}>
                      <div className="flex items-center gap-3">
                        <img src={guide.avatar} alt={guide.name} className="w-12 h-12 rounded-full object-cover border border-stone-300" />
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{guide.name}</h4>
                          <p className="text-stone-500 text-xs font-mono">{guide.lang}</p>
                          <p className="text-[#1d3a28] font-mono text-xs font-bold mt-0.5">Rp {guidePrice.toLocaleString("id-ID")} / hari</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-[#1d3a28]/10 text-[#1d3a28] border-[#1d3a28]/20"}`}>
                        {isSelected ? "Dipilih" : "Tersedia"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}