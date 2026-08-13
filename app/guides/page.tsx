"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { MOCK_GUIDES, GuideItem } from "@/lib/data/mock-tourism-data";
import { MediaPreviewModal, PreviewData } from "@/components/ui/media-preview-modal";
import { CheckCircle2, Clock, MapPin, Send, Eye, X, ListOrdered } from "lucide-react";

export default function GuidesCatalogPage() {
  const { guideRequests, createGuideRequest, cancelGuideRequest } = useBooking();
  const [selectedSpot, setSelectedSpot] = React.useState("Semua Tempat");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [requestTargetGuide, setRequestTargetGuide] = React.useState<GuideItem | null>(null);
  const [chosenSpot, setChosenSpot] = React.useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  const spotOptions = ["Semua Tempat", "Pantai Sulamadaha", "Gunung Gamalama", "Pulau Maitara", "Benteng Tolukko", "Batu Angus", "Danau Ngade"];

  const filtered = MOCK_GUIDES.filter((g) => {
    return selectedSpot === "Semua Tempat" || g.specialtySpots.includes(selectedSpot);
  });

  const handleConfirmRequest = () => {
    if (!requestTargetGuide || !chosenSpot) return;
    createGuideRequest(
      { id: requestTargetGuide.id, name: requestTargetGuide.name, price: requestTargetGuide.price, avatar: requestTargetGuide.avatar },
      chosenSpot
    );
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
          
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
          >
            <ListOrdered className="w-4 h-4 text-[#c5922e]" />
            <span>Riwayat Permintaan Pemandu ({guideRequests.length})</span>
          </button>
        </div>

        {/* Filter Keahlian Tempat */}
        <div className="flex gap-2 overflow-x-auto pb-6 text-xs font-semibold">
          {spotOptions.map((spot) => (
            <button
              key={spot}
              onClick={() => setSelectedSpot(spot)}
              className={`px-4 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer border shrink-0 ${
                selectedSpot === spot ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"
              }`}
            >
              {spot}
            </button>
          ))}
        </div>

        {/* Grid Pemandu Wisata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((guide) => {
            const isAvailable = guide.status === "Tersedia";
            const activeReq = guideRequests.find((r) => r.guideId === guide.id);

            return (
              <div key={guide.id} className="bg-white border border-stone-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center group">
                <div 
                  onClick={() => setPreviewData({ type: "guide", id: guide.id, name: guide.name, price: guide.price, img: guide.avatar, categoryOrLang: guide.lang, rating: guide.rating })}
                  className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border border-stone-200 bg-stone-100 shadow-inner cursor-pointer"
                >
                  <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* 2-3 Keahlian Tempat */}
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {guide.specialtySpots.map((spot, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-[#c5922e]/10 text-[#c5922e] border border-[#c5922e]/20 text-[9px] font-bold uppercase">
                      <MapPin className="w-2.5 h-2.5 inline mr-0.5" />{spot}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-0.5">{guide.name}</h3>
                <p className="text-stone-500 text-xs mb-2 font-medium">{guide.lang}</p>

                <p className="text-[#1d3a28] font-bold text-sm mb-4">
                  Rp {guide.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari temani</span>
                </p>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-sans">
                  <span>{guide.completedTours}x Mendampingi</span>
                  {isAvailable ? (
                    <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Sibuk</span>
                  )}
                </div>

                {activeReq ? (
                  <button onClick={() => setIsHistoryOpen(true)} className="w-full py-2.5 rounded-xl bg-[#c5922e] text-stone-900 font-bold text-xs uppercase tracking-wider cursor-pointer">
                    PERMINTAAN DIKIRIM (CEK STATUS)
                  </button>
                ) : (
                  <button
                    disabled={!isAvailable}
                    onClick={() => { setRequestTargetGuide(guide); setChosenSpot(guide.specialtySpots[0]); }}
                    className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                      !isAvailable ? "bg-stone-300 text-stone-500 cursor-not-allowed" : "bg-stone-900 text-white hover:bg-[#1d3a28]"
                    }`}
                  >
                    {!isAvailable ? "TIDAK TERSEDIA" : <><Send className="w-3.5 h-3.5" /> KIRIM PERMINTAAN DAMPINGAN</>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Pilih Destinasi untuk Pemandu */}
      {requestTargetGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#f4f2eb] p-6 rounded-2xl max-w-md w-full border border-stone-300 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Pilih Destinasi Pendampingan</h3>
            <p className="text-xs text-stone-600">Pemandu <strong>{requestTargetGuide.name}</strong> ahli di lokasi berikut. Pilih lokasi yang ingin Anda kunjungi:</p>
            
            <select value={chosenSpot} onChange={(e) => setChosenSpot(e.target.value)} className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800">
              {requestTargetGuide.specialtySpots.map((spot) => (
                <option key={spot} value={spot}>{spot}</option>
              ))}
            </select>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setRequestTargetGuide(null)} className="flex-1 py-2.5 bg-stone-200 text-stone-800 font-bold rounded-xl text-xs uppercase cursor-pointer">Batal</button>
              <button onClick={handleConfirmRequest} className="flex-1 py-2.5 bg-[#1d3a28] text-white font-bold rounded-xl text-xs uppercase cursor-pointer">Kirim Permintaan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Riwayat Permintaan Pemandu & Fitur Batal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#f4f2eb] p-6 rounded-2xl max-w-lg w-full border border-stone-300 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-300 pb-3">
              <h3 className="font-bold text-sm uppercase">Riwayat Permintaan Pemandu Wisata</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            {guideRequests.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">Belum ada permintaan dikirim.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {guideRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-white rounded-xl border border-stone-300 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{req.guideName} ({req.selectedDestination})</p>
                      <p className="text-[11px] text-stone-500">Tarif: Rp {req.price.toLocaleString("id-ID")} / hari</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">
                        {req.status === "menunggu_konfirmasi" ? "Menunggu Konfirmasi Pemandu" : "Disetujui"}
                      </span>
                    </div>
                    {req.status === "menunggu_konfirmasi" && (
                      <button onClick={() => cancelGuideRequest(req.id)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase cursor-pointer">
                        Batalkan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <MediaPreviewModal data={previewData} onClose={() => setPreviewData(null)} />
    </main>
  );
}