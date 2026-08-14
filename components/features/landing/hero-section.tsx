"use client";

import * as React from "react";
import { Playfair_Display } from "next/font/google";
import { ArrowDownRight } from "lucide-react";
import { smoothScrollToElement } from "@/lib/utils/scroll-utils";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["normal", "italic"] });

export function HeroSection() {
  return (
    <section className="w-full min-h-screen bg-[#f4f2eb] text-stone-900 pt-24 border-b border-stone-300 flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Typography & Action */}
        <div className="p-8 sm:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-stone-300">
          <span className="font-mono text-xs text-[#1d3a28] tracking-widest uppercase mb-6 block font-bold">
            [ EXPEDITION JOURNAL 2025 ]
          </span>
          <h1 className={`${playfair.className} text-6xl sm:text-8xl font-black italic text-stone-900 leading-[0.9] tracking-tight mb-8`}>
            Petualangan <br />
            <span className="not-italic text-[#1d3a28]">Tanpa Batas.</span>
          </h1>
          <p className="text-stone-700 text-base sm:text-lg font-light max-w-md mb-12 leading-relaxed">
            Eksplorasi panorama alami Ternate. Sewa peralatan outdoor teruji dan nikmati perjalanan bersama Tour Guide lokal bersertifikat.
          </p>
          <button 
            onClick={() => smoothScrollToElement("catalog-section")}
            className="bg-stone-900 hover:bg-[#1d3a28] text-stone-100 px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-3 cursor-pointer w-fit"
          >
            <span>Mulai Eksplorasi</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Pure Flat Image (No Radius, No Shadow) */}
        <div className="relative w-full h-[50vh] lg:h-auto bg-stone-200">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop" 
            alt="Pemandangan Ternate" 
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#f4f2eb] border-t border-stone-300 font-mono text-[10px] text-stone-600 uppercase tracking-widest flex justify-between">
            <span>LOC: GAMALAMA MOUNTAIN</span>
            <span>ALT: 1,715M</span>
          </div>
        </div>
      </div>
    </section>
  );
}
