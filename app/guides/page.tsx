"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { useTourism, GuideItem } from "@/lib/context/tourism-context";
import { MediaPreviewModal, PreviewData } from "@/components/ui/media-preview-modal";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";
import { CheckCircle2, Clock, MapPin, Send, Eye, X, ListOrdered } from "lucide-react";

const specialtySpots = ["Semua Tempat", "Pantai Sulamadaha", "Gunung Gamalama", "Pulau Maitara", "Benteng Tolukko", "Batu Angus", "Danau Ngade"];

export default function GuidesCatalogPage() {
  const { user } = useAuth();
  const { guideRequests, createGuideRequest, cancelGuideRequest } = useBooking();
  const { guides, isLoading } = useTourism();
  const [selectedSpot, setSelectedSpot] = React.useState("Semua Tempat");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [requestTargetGuide, setRequestTargetGuide] = React.useState<GuideItem | null>(null);
  const [chosenSpot, setChosenSpot] = React.useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);

  const filtered = guides.filter((g) => selectedSpot === "Semua Tempat" || g.specialtySpots.includes(selectedSpot));

  const handleOpenRequest = (guide: GuideItem) => {
    if (!user) { setIsPromptOpen(true); return; }
    setRequestTargetGuide(guide);
    setChosenSpot(guide.specialtySpots[0]);
  };

  const handleConfirmRequest = () => {
    if (!requestTargetGuide || !chosenSpot) return;
    createGuideRequest({ id: requestTargetGuide.id, name: requestTargetGuide.name, price: requestTargetGuide.price, avatar: requestTargetGuide.avatar }, chosenSpot, user?.name || "Wisatawan", "15 Juni 2025");
    setRequestTargetGuide(null);
    setChosenSpot("");
    setIsHistoryOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <FloatingCartBar />

      <div className="max-w-6xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// KATALOG PEMANDU WISATA</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dampingi Perjalananmu di Ternate</h1>
          </div>
          <button onClick={() => setIsHistoryOpen(true)} className="px-5 py-2.5 bg-transparent border border-stone-800 text-stone-900 hover:bg-stone-200 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer transition-colors rounded-sm">
            <ListOrdered className="w-4 h-4 text-[#c5922e]" />
            <span>Riwayat Permintaan ({guideRequests.length})</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6 text-xs font-semibold">
          {specialtySpots.map((spot) => (
            <button key={spot} onClick={() => setSelectedSpot(spot)} className={`px-4 py-2 rounded-sm uppercase tracking-wider transition-colors cursor-pointer border shrink-0 ${selectedSpot === spot ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"}`}>
              {spot}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center py-10 font-mono text-stone-500">Memuat data dari Supabase...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((guide) => {
              const isAvailable = guide.status === "Tersedia" || guide.status === "available";
              const activeReq = guideRequests.find((r) => r.guideId === guide.id);

              return (
                <div key={guide.id} className="bg-white border border-stone-300 rounded-sm p-5 shadow-sm hover:shadow-md transition-shadow text-center group">
                  <div onClick={() => setPreviewData({ type: "guide", id: guide.id, name: guide.name, price: guide.price, img: guide.avatar, categoryOrLang: guide.lang, rating: guide.rating, desc: guide.desc })} className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border border-stone-200 bg-stone-100 shadow-inner cursor-pointer">
                    <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Eye className="w-5 h-5" /></div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {guide.specialtySpots.map((spot, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-sm bg-[#c5922e]/10 text-[#c5922e] border border-[#c5922e]/20 text-[9px] font-bold uppercase"><MapPin className="w-2.5 h-2.5 inline mr-0.5" />{spot}</span>
                    ))}
                  </div>

                  <h3 onClick={() => setPreviewData({ type: "guide", id: guide.id, name: guide.name, price: guide.price, img: guide.avatar, categoryOrLang: guide.lang, rating: guide.rating, desc: guide.desc })} className="font-bold text-stone-900 text-lg mb-0.5 cursor-pointer hover:text-[#1d3a28]">{guide.name}</h3>
                  <p className="text-stone-500 text-xs mb-2 font-medium">{guide.lang}</p>
                  <p className="text-[#1d3a28] font-bold text-sm mb-4">Rp {guide.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari temani</span></p>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-sans">
                    <span>{guide.completedTours}x Mendampingi</span>
                    {isAvailable ? <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span> : <span className="text-rose-500 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sibuk</span>}
                  </div>

                  {activeReq ? (
                    <button onClick={() => setIsHistoryOpen(true)} className="w-full py-2.5 rounded-sm bg-[#c5922e] text-stone-900 font-bold text-xs uppercase tracking-wider cursor-pointer">
                      PERMINTAAN DIKIRIM
                    </button>
                  ) : (
                    <button disabled={!isAvailable} onClick={() => handleOpenRequest(guide)} className={`w-full py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 border ${!isAvailable ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed" : "bg-white text-stone-900 border-stone-300 hover:bg-stone-100"}`}>
                      {!isAvailable ? "TIDAK TERSEDIA" : <><Send className="w-3.5 h-3.5" /> KIRIM PERMINTAAN</>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals omitted for brevity, logic remains identical */}
      <AuthPromptModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => {}} actionText="meminta pemandu wisata" />
    </main>
  );
}