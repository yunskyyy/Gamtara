"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Compass } from "lucide-react";
import { DestinationData } from "./destination-detail-modal";

const destinationList: DestinationData[] = [
  {
    id: "sulamadaha",
    title: "Pantai Sulamadaha",
    tag: "Bahari & Kaca Alami",
    desc: "Laut tenang sejernih kaca. Tempat sempurna untuk snorkeling dan menjelajahi tebing karang bersejarah.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop",
    suggestedTools: [
      { name: "Set Snorkeling Pro", price: "35.000", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop" },
      { name: "Kamera Action 4K Waterproof", price: "85.000", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop" },
    ],
    guides: [
      { name: "Fikri Subur", lang: "Bahasa Indonesia, English", status: "available", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop" },
      { name: "Rizal Maitara", lang: "Bahasa Indonesia", status: "busy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop" },
    ],
  },
  {
    id: "tolire",
    title: "Danau Tolire Unik",
    tag: "Wisata Legenda Vulkanik",
    desc: "Danau raksasa hijau di bawah Kaki Gamalama dengan tebing curam dan cerita legenda mistis yang menakjubkan.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop",
    suggestedTools: [
      { name: "Tenda Dome 4P", price: "50.000", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&auto=format&fit=crop" },
      { name: "Teropong Binocular", price: "25.000", img: "https://images.unsplash.com/photo-1559523161-0fc0d6b28f44?w=400&auto=format&fit=crop" },
    ],
    guides: [
      { name: "Usman Gamalama", lang: "Bahasa Indonesia, Deutsch", status: "available", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop" },
    ],
  },
  {
    id: "maitara",
    title: "Pulau Maitara & Tidore",
    tag: "Ikonik Uang Seribu",
    desc: "Pemandangan legendaris pecahan uang seribu rupiah dengan latar dua pulau vulkanik anggun di tengah selat.",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop",
    suggestedTools: [
      { name: "Set Snorkeling Pro", price: "35.000", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop" },
    ],
    guides: [
      { name: "Rizal Maitara", lang: "Bahasa Indonesia", status: "available", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop" },
    ],
  },
];

interface SectionsProps {
  onSelectDestination: (dest: DestinationData) => void;
}

export function DestinationSections({ onSelectDestination }: SectionsProps) {
  return (
    <div className="w-full bg-stone-950">
      {destinationList.map((dest, idx) => {
        const isEven = idx % 2 === 1; // Genap = Kanan, Ganjil = Kiri

        return (
          <React.Fragment key={dest.id}>
            {/* Pembatas Organik: Multi-layer SVG Gelombang & Floating Badge */}
            {idx > 0 && (
              <div className="relative w-full h-24 -my-12 z-30 pointer-events-none overflow-hidden flex items-center justify-center">
                {/* Layer 1: Emerald Glow Ambient Wave */}
                <svg className="absolute inset-0 w-full h-full text-emerald-950/40" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="currentColor">
                  <path d="M0,30 C320,110 420,-10 720,50 C1020,110 1120,20 1440,40 L1440,120 L0,120 Z"></path>
                </svg>

                {/* Layer 2: Main Dark Organic Ridge */}
                <svg className="absolute inset-0 w-full h-full text-stone-950 opacity-95" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="currentColor">
                  <path d="M0,60 C360,10 600,100 900,20 C1200,-20 1320,80 1440,40 L1440,120 L0,120 Z"></path>
                </svg>

                {/* Floating Expedition Badge di atas Kurva Gelombang */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="relative z-40 px-5 py-2 rounded-full bg-stone-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest backdrop-blur-md shadow-lg shadow-emerald-950/50 flex items-center gap-2.5 pointer-events-auto"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>0°47'N 127°22'E</span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-300 font-semibold uppercase">PART 0{idx + 1}</span>
                </motion.div>
              </div>
            )}

            {/* Section Destinasi Utama */}
            <section className="relative w-full h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0 bg-stone-900">
                <img 
                  src={dest.img} 
                  alt={dest.title} 
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className={`absolute inset-0 ${
                  isEven 
                    ? "bg-gradient-to-l from-black/95 via-black/60 to-black/20" 
                    : "bg-gradient-to-r from-black/95 via-black/60 to-black/20"
                }`} />
              </div>

              {/* Decorative Route Line Overlay */}
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 200 Q 300 400 600 200 T 1100 500" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
              </svg>

              {/* Content Box (Zig-Zag Layout) */}
              <div className={`relative z-20 max-w-6xl w-full mx-auto px-6 flex flex-col justify-center ${
                isEven ? "items-end text-right" : "items-start text-left"
              }`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className={`max-w-xl flex flex-col ${isEven ? "items-end" : "items-start"}`}
                >
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-4 inline-block">
                    PART 0{idx + 1} — {dest.tag}
                  </span>

                  <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                    {dest.title}
                  </h2>

                  <p className="text-stone-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
                    {dest.desc}
                  </p>

                  <Button 
                    onClick={() => onSelectDestination(dest)}
                    size="lg" 
                    className="rounded-full px-8 bg-white text-stone-900 hover:bg-emerald-500 hover:text-white transition-all duration-300 font-semibold gap-2"
                  >
                    Eksplorasi Alat & Tour Guide
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </section>
          </React.Fragment>
        );
      })}
    </div>
  );
}
