"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, ArrowUpRight, Star } from "lucide-react";

const destinations = [
  {
    id: "sulamadaha",
    title: "Pantai Sulamadaha",
    tag: "Bahari & Snorkeling",
    rating: "4.9",
    guidesCount: 12,
    desc: "Terkenal dengan laut Kaca Ajaib. Perahu seolah-olah melayang di atas air yang sangat jernih.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  },
  {
    id: "tolire",
    title: "Danau Tolire Unik",
    tag: "Wisata Alam & Legenda",
    rating: "4.8",
    guidesCount: 8,
    desc: "Danau raksasa di kaki Gunung Gamalama dengan pemandangan tebing hijau yang megah.",
    img: "https://images.unsplash.com/photo-1511497584788-876761c11969?w=800&auto=format&fit=crop",
  },
  {
    id: "maitara",
    title: "Pulau Maitara & Tidore",
    tag: "Ikonik & Pemandangan",
    rating: "5.0",
    guidesCount: 15,
    desc: "Pemandangan legendaris uang pecahan seribu rupiah dengan latar dua pulau vulkanik anggun.",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
  },
  {
    id: "tolukko",
    title: "Benteng Tolukko",
    tag: "Sejarah & Budaya",
    rating: "4.7",
    guidesCount: 6,
    desc: "Benteng peninggalan Portugis tahun 1610 dengan pemandangan langsung ke Selat Ternate.",
    img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop",
  },
];

export function DestinationShowcase() {
  return (
    <section className="py-24 bg-stone-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-3 block">
              Destinasi Unggulan Ternate
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              Jelajahi Sudut Terbaik <br className="hidden sm:block" /> Pulau Rempah.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-stone-500 max-w-md text-sm sm:text-base leading-relaxed">
            Pilih destinasi impianmu dan dapatkan pendampingan langsung dari Tour Guide lokal bersertifikat.
          </p>
        </div>

        {/* Grid Destinasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative h-[420px] rounded-[2.5rem] overflow-hidden bg-stone-900 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Background */}
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges Top */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium">
                  {item.tag}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-2">
                  <Users className="w-4 h-4" />
                  <span>{item.guidesCount} Tour Guide Siap Dampingi</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm line-clamp-2 font-light mb-6 opacity-90">
                  {item.desc}
                </p>

                {/* Action CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/15">
                  <span className="text-white text-xs font-semibold tracking-wider uppercase group-hover:underline">
                    Lihat Tour Guide & Detail
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
