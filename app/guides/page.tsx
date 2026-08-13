"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { MOCK_GUIDES, GuideItem } from "@/lib/data/mock-tourism-data";
import { CheckCircle2, Clock, MapPin, User, Send } from "lucide-react";

export default function GuidesCatalogPage() {
  const { selectedGuide, selectGuide } = useBooking();
  const [requestedGuide, setRequestedGuide] = React.useState<GuideItem | null>(null);

  const handleRequestGuide = (guide: GuideItem) => {
    setRequestedGuide(guide);
    selectGuide(guide);
    alert(`Permintaan pendampingan dikirim ke ${guide.name}! Menunggu konfirmasi pemandu wisata mengenai tanggal & lokasi.`);
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <FloatingCartBar />

      <div className="max-w-6xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// KATALOG PEMANDU WISATA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Pemandu Wisata Lokal Ternate</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {MOCK_GUIDES.map((guide) => {
            const isSelected = selectedGuide?.id === guide.id;
            const isAvailable = guide.status === "Tersedia";

            return (
              <div key={guide.id} className="bg-white border border-stone-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border border-stone-200 bg-stone-100 shadow-inner">
                  <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover" />
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c5922e]/10 text-[#c5922e] border border-[#c5922e]/20 text-[10px] font-bold uppercase mb-2">
                  <MapPin className="w-3 h-3" /> Ahli: {guide.specialtySpot}
                </span>

                <h3 className="font-bold text-stone-900 text-lg mb-0.5">{guide.name}</h3>
                <p className="text-stone-600 text-xs mb-2 leading-relaxed px-2">{guide.desc}</p>

                {/* Info Lengkap: Asal, Alamat & Gender */}
                <div className="bg-[#f4f2eb] p-2.5 rounded-xl border border-stone-200 mb-3 text-left text-[11px] space-y-1 font-sans">
                  <p><strong>Asal Pemandu:</strong> {guide.origin}</p>
                  <p><strong>Alamat:</strong> {guide.address}</p>
                  <p className="flex items-center gap-1"><strong>Gender:</strong> <User className="w-3 h-3 text-[#1d3a28]" /> {guide.gender}</p>
                  <p><strong>Bahasa:</strong> {guide.lang}</p>
                </div>

                <p className="text-[#1d3a28] font-bold text-sm mb-3">
                  Rp {guide.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari temani</span>
                </p>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-sans">
                  <span>Rating: {guide.rating}? ({guide.completedTours}x Temani)</span>
                  {isAvailable ? (
                    <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sibuk</span>
                  )}
                </div>

                {/* Alur Permintaan dulu sebelum Bayar */}
                <button
                  disabled={!isAvailable}
                  onClick={() => handleRequestGuide(guide)}
                  className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    !isAvailable ? "bg-stone-300 text-stone-500 cursor-not-allowed" : isSelected ? "bg-[#1d3a28] text-white" : "bg-stone-900 text-white hover:bg-[#1d3a28]"
                  }`}
                >
                  {!isAvailable ? "TIDAK TERSEDIA" : isSelected ? "PERMINTAAN DIKIRIM" : <><Send className="w-3.5 h-3.5" /> KIRIM PERMINTAAN DAMPINGAN</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
