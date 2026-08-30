"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { useTourism, ToolItem } from "@/lib/context/tourism-context";
import { MediaPreviewModal, PreviewData } from "@/components/ui/media-preview-modal";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";
import { Search, CheckCircle2, Check, MapPin, Eye, Store } from "lucide-react";

export default function ToolsCatalogPage() {
  const { user } = useAuth();
  const { selectedTools, toggleTool } = useBooking();
  const { tools, isLoading } = useTourism();
  const [selectedCategory, setSelectedCategory] = React.useState("Semua");
  const [selectedOwner, setSelectedOwner] = React.useState("Semua Toko");
  const [search, setSearch] = React.useState("");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);

  const ownerList = ["Semua Toko", ...Array.from(new Set(tools.map((t) => t.ownerName)))];

  const filtered = tools.filter((t) => {
    const matchCat = selectedCategory === "Semua" || t.category === selectedCategory;
    const matchOwner = selectedOwner === "Semua Toko" || t.ownerName === selectedOwner;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchOwner && matchSearch;
  });

  const handleSelectTool = (tool: ToolItem) => {
    if (!user) { setIsPromptOpen(true); return; }
    toggleTool({ id: tool.id, name: tool.name, price: tool.price, ownerName: tool.ownerName, img: tool.img, vendorId: tool.vendorId });
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <FloatingCartBar />

      <div className="max-w-6xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// KATALOG UTAMA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Sewa Alat Wisata Ternate</h1>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-semibold">
              {["Semua", "Camping", "Bahari", "Fotografi", "Hiking"].map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-none uppercase tracking-wider transition-colors cursor-pointer border shrink-0 ${selectedCategory === cat ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input type="text" placeholder="Cari peralatan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-none text-xs w-full sm:w-64 focus:outline-none focus:border-[#1d3a28]" />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-mono font-bold text-stone-600 shrink-0 flex items-center gap-1"><Store className="w-3.5 h-3.5 text-[#1d3a28]" /> Toko Pemilik:</span>
            {ownerList.map((owner) => (
              <button key={owner} onClick={() => setSelectedOwner(owner)} className={`px-3 py-1 rounded-none text-[11px] font-medium transition-colors cursor-pointer border shrink-0 ${selectedOwner === owner ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-600 border-stone-200"}`}>
                {owner}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-center py-10 font-mono text-stone-500">Memuat data dari Supabase...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((tool) => {
              const isSelected = selectedTools.some((t) => t.id === tool.id);
              return (
                <div key={tool.id} className="bg-white border border-stone-300 rounded-none p-5 shadow-sm hover:shadow-md transition-shadow text-center group">
                  <div onClick={() => setPreviewData({ type: "tool", id: tool.id, name: tool.name, price: tool.price, img: tool.img, ownerName: tool.ownerName, categoryOrLang: tool.category, rating: tool.rating })} className="relative w-28 h-28 rounded-none overflow-hidden mx-auto mb-3 border border-stone-200 bg-stone-100 shadow-inner cursor-pointer">
                    <img src={tool.img} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Eye className="w-5 h-5" /></div>
                  </div>
                  <h3 onClick={() => setPreviewData({ type: "tool", id: tool.id, name: tool.name, price: tool.price, img: tool.img, ownerName: tool.ownerName, categoryOrLang: tool.category, rating: tool.rating })} className="font-bold text-stone-900 text-lg mb-0.5 cursor-pointer hover:text-[#1d3a28]">{tool.name}</h3>
                  <p className="text-[#c5922e] text-xs font-bold mb-2 flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5" /> Penyedia: {tool.ownerName} ({tool.loc})</p>
                  <p className="text-[#1d3a28] font-bold text-sm mb-4">Rp {tool.price.toLocaleString("id-ID")} <span className="text-stone-500 font-normal">/ hari</span></p>
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-4 font-sans">
                    <span>{tool.rentCount}x Disewa</span>
                    <span className="text-[#1d3a28] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
                  </div>
                  <button onClick={() => handleSelectTool(tool)} className={`w-full py-2.5 rounded-none text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${isSelected ? "bg-[#1d3a28] text-white" : "bg-stone-900 text-white hover:bg-[#1d3a28]"}`}>
                    {isSelected ? <><Check className="w-4 h-4" /> TERPILIH</> : "PILIH ALAT"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MediaPreviewModal data={previewData} onClose={() => setPreviewData(null)} />
      <AuthPromptModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => {}} actionText="menyewa peralatan outdoor" />
    </main>
  );
}
