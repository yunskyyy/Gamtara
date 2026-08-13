"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { MOCK_GUIDES } from "@/lib/data/mock-tourism-data";
import { MediaPreviewModal, PreviewData } from "@/components/ui/media-preview-modal";
import { CheckCircle2, Clock, Check, MapPin, Eye } from "lucide-react";

const specialtySpots = ["Semua Tempat", "Pantai Sulamadaha", "Gunung Gamalama", "Pulau Maitara", "Benteng Tolukko", "Danau Ngade"];

export default function GuidesCatalogPage() {
  const { selectedGuide, selectGuide } = useBooking();
  const [selectedSpot, setSelectedSpot] = React.useState("Semua Tempat");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);

  const filtered = MOCK_GUIDES.filter((g) => {
    return selectedSpot === "Semua Tempat" || g.specialtySpot === selectedSpot;
  });

  return (
    <main className="min-h-screen bg-[#f5f3ec] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <FloatingCartBar />

      <div className="max-w-6xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// KATALOG TOUR GUIDE</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dampingi Perjalananmu di Ternate</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6 text-xs font-mono font-semibold">
          {specialtySpots.map((spot) => (
            <button key={spot} onClick={() => setSelectedSpot(spot)} className={`px-4 py-2 rounded-sm uppercase tracking-wider transition-colors cursor-pointer border shrink-0 ${selectedSpot === spot ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>
              {spot}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((guide) => {
            const isSelected = selectedGuide?.id === guide.id;
            const isAvailable = guide.status === "available";

            return (
              <div key={guide.id} className="bg-white border border-stone-300 rounded-sm p-5 shadow-sm hover:shadow-md transition-shadow text-center group">
                <div onClick={() => setPreviewData({ type: "guide", id: guide.id, name: guide.name, price: guide.price, img: guide.avatar, categoryOrLang: guide.lang, rating: guide.rating })} className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border border-stone-300 bg-stone-100 shadow-inner cursor-pointer">
                  <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Eye className="w-5 h-5" /></div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[#c5922e]/10 text-[#c5922e] border border-[#c5922e]/30 text-[10px] font-mono font-bold uppercase mb-2">
                  <MapPin className="w-3 h-3" /> Ahli: {guide.specialtySpot}
                </span>

                <h3 onClick={() => setPreviewData({ type: "guide", id: guide.id, name: guide.name, price: guide.price, img: guide.avatar, categoryOrLang: guide.lang, rating: guide.rating })} className="font-bold text-stone-900 text-lg mb-0.5 cursor-pointer hover:text-[#1d3a28]">{guide.name}</h3>
                <p className="text-stone-500 text-xs mb-2 font-medium">{guide.lang}</p>
                <p className="text-[#1d3a28] font-bold text-sm font-mono mb-4">Rp {guide.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari</span></p>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-mono">
                  <span>{guide.completedTours}x Mendampingi</span>
                  {isAvailable ? <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span> : <span className="text-rose-500 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sibuk</span>}
                </div>

                <button disabled={!isAvailable} onClick={() => selectGuide(guide)} className={`w-full py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer border ${!isAvailable ? "bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed" : isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-stone-900 text-white hover:bg-[#1d3a28] border-stone-900"}`}>
                  {!isAvailable ? "TIDAK TERSEDIA" : isSelected ? <><Check className="w-4 h-4" /> TERPILIH</> : "PILIH TOUR GUIDE"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <MediaPreviewModal data={previewData} onClose={() => setPreviewData(null)} />
    </main>
  );
}
