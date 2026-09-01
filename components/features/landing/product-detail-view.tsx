"use client";
import * as React from "react";
import { ArrowLeft, MapPin, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useBooking } from "@/lib/context/booking-context";
import { ToolItem } from "@/lib/context/tourism-context";
import { useRouter } from "next/navigation";

export function ProductDetailView({ tool }: { tool: ToolItem }) {
  const router = useRouter();
  const { selectedTools, toggleTool } = useBooking();
  const isSelected = selectedTools.some((t) => t.id === tool.id);

  return (
    <div className="min-h-screen bg-[#f4f2eb] text-stone-900 font-sans pb-32">
      <div className="max-w-5xl mx-auto pt-24 px-6">
        <button onClick={() => router.back()} className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8 hover:text-[#1d3a28] cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 h-[500px] bg-stone-200 border border-stone-800 rounded-sm overflow-hidden">
            <img src={tool.img} className="w-full h-full object-cover grayscale-[10%]" alt={tool.name} />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">{tool.name}</h1>
              <p className="font-mono text-xs text-[#c5922e] font-bold uppercase tracking-widest mb-6">SKU: {tool.id.substring(0, 8).toUpperCase()}</p>
              
              <div className="border-y border-stone-300 py-4 mb-6 space-y-2">
                <p className="text-2xl font-black text-[#1d3a28] font-mono">Rp {tool.price.toLocaleString("id-ID")} <span className="text-xs text-stone-500 font-sans font-normal">/ hari</span></p>
                <p className="text-xs font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1d3a28]"/> Toko: {tool.ownerName} ({tool.dist})</p>
              </div>

              <div className="bg-white border border-stone-800 p-4 rounded-sm mb-6">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest mb-3 text-stone-500">Jadwal Sewa (08:00 - 20:00 WIT)</h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div><label className="block mb-1">Tgl Ambil</label><input type="date" className="w-full p-2 border border-stone-300 rounded-sm bg-[#f4f2eb]" /></div>
                  <div><label className="block mb-1">Tgl Kembali</label><input type="date" className="w-full p-2 border border-stone-300 rounded-sm bg-[#f4f2eb]" /></div>
                </div>
                <p className="mt-3 text-[10px] font-bold text-[#1d3a28] bg-emerald-100 p-2 border border-emerald-200 rounded-sm">Durasi: 3 Hari (Stok Tersedia: {tool.stock} Unit)</p>
              </div>
            </div>

            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-widest border-t border-stone-300 pt-4">
              Specs: {tool.desc}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 w-96 bg-[#f4f2eb] border border-stone-800 p-5 shadow-[8px_8px_0px_0px_rgba(29,58,40,1)] rounded-sm">
        <h4 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-stone-800 pb-2 mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" /> Struk Sewa Temporer
        </h4>
        <div className="space-y-2 font-mono text-xs mb-4">
          <div className="flex justify-between"><span>1x {tool.name} (3 Hari)</span><span className="font-bold">Rp {(tool.price * 3).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between text-stone-500 text-[10px]"><span>Lokasi Kirim: Kota Ternate ({tool.dist})</span><span className="text-emerald-600 font-bold">VALID</span></div>
        </div>
        <button onClick={() => toggleTool(tool)} className={`w-full py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm transition-colors cursor-pointer ${isSelected ? "bg-stone-200 text-stone-800 border border-stone-800" : "bg-[#1d3a28] text-white hover:bg-[#152a1b]"}`}>
          {isSelected ? <><Check className="w-4 h-4" /> Terpilih</> : <><ShoppingBag className="w-4 h-4" /> Tambah ke Struk</>}
        </button>
        {isSelected && (
          <button onClick={() => router.push("/checkout")} className="w-full mt-2 py-3 bg-[#c5922e] text-stone-900 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm hover:bg-[#a37826] transition-colors cursor-pointer">
            Lanjut Checkout <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}