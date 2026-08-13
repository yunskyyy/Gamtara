"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { MOCK_TOOLS } from "@/lib/data/mock-tourism-data";
import { calculateDistanceKm, TERNATE_CENTER_LAT, TERNATE_CENTER_LNG } from "@/lib/utils/geo-utils";
import { Search, CheckCircle2, Check, MapPin, Store } from "lucide-react";

export default function ToolsCatalogPage() {
  const { selectedTools, toggleTool } = useBooking();
  const [selectedCategory, setSelectedCategory] = React.useState("Semua");
  const [search, setSearch] = setSearchState();
  const [userGeo, setUserGeo] = React.useState({ lat: TERNATE_CENTER_LAT, lng: TERNATE_CENTER_LNG });

  function setSearchState() { return React.useState(""); }

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // Fallback tetap Ternate Center
      );
    }
  }, []);

  const filtered = MOCK_TOOLS.filter((t) => {
    const matchCat = selectedCategory === "Semua" || t.category === selectedCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <FloatingCartBar />

      <div className="max-w-6xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// KATALOG UTAMA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Sewa Alat Wisata Ternate</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-semibold">
            {["Semua", "Camping", "Bahari", "Fotografi"].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer border ${selectedCategory === cat ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input type="text" placeholder="Cari alat sewa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:border-[#1d3a28]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((tool) => {
            const isSelected = selectedTools.some((t) => t.id === tool.id);
            const dist = calculateDistanceKm(userGeo.lat, userGeo.lng, tool.lat, tool.lng);

            return (
              <div key={tool.id} className="bg-white border border-stone-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden mx-auto mb-3 border border-stone-200 bg-stone-100 shadow-inner">
                  <img src={tool.img} alt={tool.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-bold text-stone-900 text-lg mb-0.5">{tool.name}</h3>
                <p className="text-stone-500 text-xs mb-2 leading-relaxed px-2 line-clamp-2">{tool.desc}</p>

                {/* Pemilik Barang & Jarak Realtime */}
                <div className="bg-[#f4f2eb] p-2 rounded-xl border border-stone-200 mb-3 text-left text-xs space-y-1">
                  <p className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#1d3a28]" /> Pemilik: {tool.ownerName}
                  </p>
                  <p className="text-stone-600 text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c5922e]" /> {tool.location} • <span className="font-bold text-[#1d3a28]">{dist} KM dari lokasimu</span>
                  </p>
                </div>

                <p className="text-[#1d3a28] font-bold text-sm mb-3">
                  Rp {tool.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari</span>
                </p>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-sans">
                  <span>Rating: {tool.rating}? ({tool.rentCount}x Disewa)</span>
                  <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
                </div>

                <button onClick={() => toggleTool(tool)} className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${isSelected ? "bg-[#1d3a28] text-white" : "bg-stone-900 text-white hover:bg-[#1d3a28]"}`}>
                  {isSelected ? <><Check className="w-4 h-4" /> TERPILIH</> : "PILIH ALAT"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
