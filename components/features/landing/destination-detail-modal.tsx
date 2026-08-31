"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, MapPin, Check, Send } from "lucide-react";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { DestinationData, ToolItem, GuideItem } from "@/lib/context/tourism-context";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";
import { AuthModal } from "@/components/features/auth/auth-modal";

export type { DestinationData };

interface ModalProps {
  destination: DestinationData | null;
  onClose: () => void;
}

export function DestinationDetailModal({ destination, onClose }: ModalProps) {
  const { user } = useAuth();
  const { selectedTools, guideRequests, toggleTool, createGuideRequest } = useBooking();
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  if (!destination) return null;

  const isCustomer = user?.role === "customer";

  const handleSelectTool = (tool: ToolItem) => {
    if (!user) { setIsPromptOpen(true); return; }
    if (!isCustomer) { alert("Hanya wisatawan (Penyewa) yang dapat menyewa alat."); return; }
    toggleTool({ id: tool.id, name: tool.name, price: tool.price, ownerName: tool.ownerName || "Mitra Vendor", img: tool.img, vendorId: tool.vendorId || "v-default", lat: tool.lat || 0, lng: tool.lng || 0 });
  };

  // FUNGSI INI YANG SEBELUMNYA HILANG DAN MEMBUAT GAGAL BUILD
  const handleRequestGuide = (guide: GuideItem) => {
    if (!user) { setIsPromptOpen(true); return; }
    if (!isCustomer) { alert("Hanya wisatawan (Klien) yang dapat meminta pemandu."); return; }
    createGuideRequest(
      { id: guide.id, name: guide.name, price: guide.price, avatar: guide.avatar },
      destination.title,
      user.name,
      "15 Juni 2025"
    );
    alert(`Permintaan dampingan ke ${guide.name} berhasil dikirim! Cek profil.`);
  };

  return (
    <AnimatePresence mode="wait">
      <div key={`modal-bg-${destination.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div key={`modal-box-${destination.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#f5f3ec] text-stone-900 border border-stone-300 rounded-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 rounded-none bg-stone-900 text-white hover:bg-[#1d3a28] transition-colors cursor-pointer border border-stone-800">
            <X className="w-4 h-4" />
          </button>

          <div className="relative h-64 w-full bg-stone-900 border-b border-stone-300">
            <img src={destination.img} alt={destination.title} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[11px] px-3 py-1 rounded-none bg-[#1d3a28] text-stone-100 uppercase tracking-widest mb-2 inline-block">
                {destination.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">{destination.title}</h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8 font-sans">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-stone-800"><ShieldCheck className="w-4 h-4 text-[#1d3a28]" /> // ALAT SEWA DISARANKAN</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(destination.suggestedTools || []).map((tool, idx) => {
                  const isSelected = selectedTools.some((t) => t.id === tool.id);
                  return (
                    <div key={`modal-tool-${tool.id}-${idx}`} className={`flex items-center gap-4 p-3 rounded-none border transition-all ${isSelected ? "bg-[#1d3a28]/10 border-[#1d3a28]" : "bg-white border-stone-300"}`}>
                      <img src={tool.img} alt={tool.name} className="w-14 h-14 rounded-none object-cover border border-stone-300" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-stone-900">{tool.name}</h4>
                        <p className="text-[#1d3a28] font-mono text-xs font-bold mt-0.5">Rp {(tool.price ?? 0).toLocaleString("id-ID")} / hari</p>
                      </div>
                      {(!user || isCustomer) && (
                        <button onClick={() => handleSelectTool(tool)} className={`px-3.5 py-1.5 rounded-none font-mono text-xs uppercase font-bold cursor-pointer border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-stone-900 text-white hover:bg-[#1d3a28] border-stone-900"}`}>
                          {isSelected ? <Check className="w-4 h-4" /> : "Pilih"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-stone-800"><MapPin className="w-4 h-4 text-[#1d3a28]" /> // TOUR GUIDE LOKAL TERDAFTAR</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(destination.guides || []).map((guide, idx) => {
                  const activeReq = guideRequests.find((r) => r.guideId === guide.id);
                  const isAvailable = guide.status === "available" || guide.status === "Tersedia";

                  return (
                    <div key={`modal-guide-${guide.id}-${idx}`} className={`flex items-center justify-between p-4 rounded-none border bg-white border-stone-300`}>
                      <div className="flex items-center gap-3">
                        <img src={guide.avatar} alt={guide.name} className="w-12 h-12 rounded-sm object-cover border border-stone-300" />
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{guide.name}</h4>
                          <p className="text-stone-500 text-xs font-mono">{guide.lang}</p>
                          <p className="text-[#1d3a28] font-mono text-xs font-bold mt-0.5">Rp {(guide.price ?? 150000).toLocaleString("id-ID")} / hari</p>
                        </div>
                      </div>
                      {(!user || isCustomer) && (
                        activeReq ? (
                           <span className="text-[9px] font-bold text-[#c5922e] uppercase font-mono px-2">Diminta</span>
                        ) : (
                          <button disabled={!isAvailable} onClick={() => handleRequestGuide(guide)} className={`px-2.5 py-1.5 rounded-none text-[10px] font-mono uppercase tracking-wider font-bold border ${!isAvailable ? "bg-stone-200 text-stone-500 border-stone-300 cursor-not-allowed" : "bg-[#1d3a28] text-white border-[#1d3a28] cursor-pointer"}`}>
                            {!isAvailable ? "Sibuk" : <Send className="w-3.5 h-3.5"/>}
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AuthPromptModal key="auth-prompt-guard" isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => setIsAuthModalOpen(true)} actionText="memilih layanan" />
      <AuthModal key="auth-modal-guard" isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AnimatePresence>
  );
}
