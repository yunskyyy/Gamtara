"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useTourism, DestinationData } from "@/lib/context/tourism-context";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["normal", "italic"] });

interface SectionsProps {
  onSelectDestination: (dest: DestinationData) => void;
}

export function DestinationSections({ onSelectDestination }: SectionsProps) {
  // FIX: Panggil hook useTourism untuk mendapatkan data destinations
  const { destinations } = useTourism();

  return (
    <div className="w-full bg-[#f4f2eb] py-20 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto space-y-20">
        {destinations.map((dest, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <section key={dest.id} className="w-full border border-stone-300 bg-white flex flex-col lg:flex-row">
              <div className={`w-full lg:w-1/2 h-[400px] lg:h-[500px] border-b lg:border-b-0 ${isEven ? "lg:order-2 lg:border-l" : "lg:border-r"} border-stone-300`}>
                <img src={dest.img} alt={dest.title} className="w-full h-full object-cover grayscale-[15%]" />
              </div>

              <div className={`w-full lg:w-1/2 p-8 sm:p-14 flex flex-col justify-center ${isEven ? "lg:order-1" : ""}`}>
                <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-4 block border-b border-stone-200 pb-2">
                  [ INDEX N°0{idx + 1} ] — {dest.tag}
                </span>
                <h2 className={`${playfair.className} text-4xl sm:text-6xl font-black italic text-stone-900 mb-6 leading-none tracking-tight`}>
                  {dest.title}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base font-light mb-10 leading-relaxed">
                  {dest.desc}
                </p>
                <button onClick={() => onSelectDestination(dest)} className="inline-flex items-center justify-between bg-transparent hover:bg-stone-100 text-stone-900 px-6 py-4 border border-stone-900 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer w-full sm:w-auto">
                  <span>Eksplorasi Detail</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}