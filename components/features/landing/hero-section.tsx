"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { ArrowDownRight } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["normal", "italic"] });

export function HeroSection() {
  const handleSlowScroll = () => {
    const target = document.getElementById("catalog-section");
    if (!target) return;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 40;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 2800;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
      if (progress < duration) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#f5f3ec] text-stone-900 flex flex-col justify-between p-6 sm:p-14 pt-28 sm:pt-36 overflow-hidden border-b border-stone-300">
      <div className="z-10 flex items-center justify-between font-mono text-xs text-stone-600 border-b border-stone-300 pb-4 uppercase tracking-widest">
        <span>N°01 / TERNATE ARCHIPELAGO</span>
        <span className="hidden sm:inline">MALUKU UTARA — INDONESIA</span>
      </div>

      <div className="z-10 my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7">
          <span className="font-mono text-xs text-[#1d3a28] tracking-widest uppercase mb-3 block font-bold">// EXPEDITION JOURNAL 2025</span>
          <h1 className={`${playfair.className} text-6xl sm:text-8xl font-black italic text-stone-900 leading-[0.9] tracking-tight mb-6`}>
            Petualangan <br /><span className="not-italic text-[#1d3a28]">Tanpa Batas.</span>
          </h1>
          <p className="text-stone-700 text-base sm:text-lg font-light max-w-lg mb-8 leading-relaxed">
            Eksplorasi panorama alami Ternate. Sewa peralatan outdoor teruji dan nikmati perjalanan bersama Tour Guide lokal bersertifikat.
          </p>
          <button onClick={handleSlowScroll} className="bg-stone-900 hover:bg-[#1d3a28] text-stone-100 px-8 py-4 rounded-sm font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-lg border border-stone-800">
            <span>Mulai Eksplorasi</span>
            <ArrowDownRight className="w-4 h-4 text-[#c5922e]" />
          </button>
        </motion.div>

        <div className="lg:col-span-5 relative h-[380px] sm:h-[460px] w-full rounded-sm overflow-hidden border border-stone-300 shadow-xl bg-stone-900">
          <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop" alt="Pemandangan Ternate" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 font-mono text-[10px] text-stone-200 uppercase tracking-widest flex justify-between">
            <span>LOC: GAMALAMA MOUNTAIN</span>
            <span>ALT: 1,715M</span>
          </div>
        </div>
      </div>

      <div className="z-10 flex justify-between items-center font-mono text-xs text-stone-500 pt-4 border-t border-stone-300">
        <span>GAMTARA BESPOKE EDITION</span>
        <span className="animate-pulse">SLOW SCROLL ENABLED ↓</span>
      </div>
    </section>
  );
}
