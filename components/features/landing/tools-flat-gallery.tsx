"use client";

import * as React from "react";
import { MapPin, Check } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { MOCK_TOOLS } from "@/lib/data/mock-tourism-data";
import { useBooking } from "@/lib/context/booking-context";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["italic"] });

export function ToolsFlatGallery() {
  const { selectedTools, toggleTool } = useBooking();

  return (
    <section id="catalog-section" className="py-20 bg-[#f4f2eb] border-b border-stone-300">
      <div className="px-4 sm:px-10 mb-10 flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[#1d3a28] tracking-widest uppercase mb-2 block font-bold">// GEAR CATALOG</span>
          <h2 className={`${playfair.className} text-4xl sm:text-5xl font-black italic tracking-tight text-stone-900`}>Perlengkapan Outdoor</h2>
        </div>
        <span className="font-mono text-xs text-stone-500 uppercase tracking-widest">Geser Horizontal →</span>
      </div>

      {/* Flat Horizontal Scroll (Snap) */}
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar border-y border-stone-300">
        {MOCK_TOOLS.map((item) => {
          const isSelected = selectedTools.some((t) => t.id === item.id);

          return (
            <div key={item.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] border-r border-stone-300 bg-white flex flex-col">
              <div className="h-48 w-full bg-stone-200 border-b border-stone-300">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale-[10%]" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-stone-900 text-lg mb-1">{item.name}</h3>
                <div className="flex items-center gap-1 text-stone-600 text-xs mb-4 font-mono">
                  <MapPin className="w-3 h-3 text-[#1d3a28]" /> <span>{item.loc}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900 font-mono">Rp {item.price.toLocaleString("id-ID")}</span>
                  <button onClick={() => toggleTool(item)} className={`px-4 py-2 font-mono text-[10px] uppercase font-bold border transition-colors ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-transparent text-stone-900 border-stone-900 hover:bg-stone-100"}`}>
                    {isSelected ? <Check className="w-3 h-3" /> : "Pilih"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
