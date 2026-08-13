"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Tent } from "lucide-react";

// Mock Data Alat Sewa
const tools = [
  { id: 1, name: "Tenda Dome 4P", price: "50.000", loc: "Ternate Tengah", img: "https://images.unsplash.com/photo-1504280390467-336c18bf2288?q=80&w=800&auto=format&fit=crop" },
  { id: 2, name: "Carrier 60L", price: "40.000", loc: "Ternate Selatan", img: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=800&auto=format&fit=crop" },
  { id: 3, name: "Sepatu Trekking", price: "35.000", loc: "Ternate Utara", img: "https://images.unsplash.com/photo-1520316587275-5e4f06f68971?q=80&w=800&auto=format&fit=crop" },
  { id: 4, name: "Set Snorkeling", price: "30.000", loc: "Pulau Hiri", img: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop" },
  { id: 5, name: "Headlamp Pro", price: "15.000", loc: "Ternate Tengah", img: "https://images.unsplash.com/photo-1559523161-0fc0d6b28f44?q=80&w=800&auto=format&fit=crop" },
];

// Gandakan array untuk efek infinite loop yang mulus
const duplicatedTools = [...tools, ...tools, ...tools];

export function ToolsMarquee() {
  return (
    <section className="py-20 bg-stone-50 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
            Persiapkan Petualanganmu
          </h2>
          <p className="text-stone-500 font-medium">
            Sewa perlengkapan outdoor berkualitas dari vendor lokal terpercaya.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-emerald-600 font-semibold text-sm cursor-pointer hover:text-emerald-700">
            Lihat Semua Alat &rarr;
          </span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden group">
        {/* Gradient Masking untuk efek fade di ujung kiri & kanan */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

        {/* Track Animasi */}
        <div className="flex w-max animate-marquee gap-6 px-4">
          {duplicatedTools.map((tool, idx) => (
            <Card 
              key={`${tool.id}-${idx}`} 
              isInteractive 
              className="w-64 sm:w-72 shrink-0 p-3 bg-white border-stone-200/60"
            >
              <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-stone-100">
                <img 
                  src={tool.img} 
                  alt={tool.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                  <Tent className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="font-bold text-stone-900 text-lg mb-1">{tool.name}</h3>
                <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tool.loc}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-xs text-stone-500 block">Harga / hari</span>
                    <span className="font-bold text-emerald-600">Rp {tool.price}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    +
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
