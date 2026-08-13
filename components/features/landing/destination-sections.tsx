"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { MOCK_DESTINATIONS, DestinationData } from "@/lib/data/mock-tourism-data";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["normal", "italic"] });

interface SectionsProps {
  onSelectDestination: (dest: DestinationData) => void;
}

export function DestinationSections({ onSelectDestination }: SectionsProps) {
  return (
    <div className="w-full bg-[#f5f3ec] py-20 px-4 sm:px-10 space-y-28 sm:space-y-40 text-stone-900">
      {MOCK_DESTINATIONS.map((dest, idx) => {
        const isEven = idx % 2 === 1;

        return (
          <section key={dest.id} className="relative w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-6 font-mono text-xs text-stone-600 uppercase tracking-widest">
              <span>[ DESTINATION INDEX N°0{idx + 1} ]</span>
              <span className="font-bold text-stone-800">MALUKU UTARA — {dest.tag}</span>
            </div>

            <div className="relative w-full h-[78vh] min-h-[520px] rounded-sm overflow-hidden border border-stone-300 shadow-xl group bg-stone-900">
              <img src={dest.img} alt={dest.title} className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent" />

              <div className={`absolute inset-0 p-8 sm:p-14 flex flex-col justify-end ${isEven ? "items-end text-right" : "items-start text-left"}`}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`max-w-xl flex flex-col ${isEven ? "items-end" : "items-start"}`}>
                  <h2 className={`${playfair.className} text-5xl sm:text-7xl font-black italic text-stone-100 mb-4 leading-none tracking-tight drop-shadow-md`}>
                    {dest.title}
                  </h2>
                  <p className="text-stone-200 text-sm sm:text-base font-light mb-8 leading-relaxed max-w-md drop-shadow">
                    {dest.desc}
                  </p>
                  <button onClick={() => onSelectDestination(dest)} className="inline-flex items-center gap-3 bg-stone-900 hover:bg-[#1d3a28] text-stone-100 px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-all duration-300 shadow-lg border border-stone-700 cursor-pointer">
                    <span>Eksplorasi Detail & Guide</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c5922e]" />
                  </button>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
