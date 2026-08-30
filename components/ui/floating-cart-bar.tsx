"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/context/booking-context";
import { ShoppingBag, ArrowRight, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";

export function FloatingCartBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedTools, toggleTool, totalPrice, clearBooking } = useBooking();
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  const hasItems = selectedTools.length > 0;
  const isCheckoutPage = pathname === "/checkout";

  // Sembunyikan keranjang jika kosong ATAU sedang berada di halaman checkout
  if (!hasItems || isCheckoutPage) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-6 right-6 z-50 pointer-events-none w-80 sm:w-96 font-mono text-xs">
        <div className="pointer-events-auto bg-[#f9f8f3] border border-stone-300 text-stone-900 rounded-none p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1d3a28]" />
              <span className="font-extrabold tracking-wider uppercase text-stone-900">KERANJANG ALAT SEWA</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:text-[#1d3a28] cursor-pointer">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button type="button" onClick={clearBooking} className="p-1 hover:text-rose-600 cursor-pointer" title="Kosongkan">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-3">
              {selectedTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between bg-white p-2 rounded-none border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <img src={tool.img} alt={tool.name} className="w-8 h-8 rounded-none object-cover border border-stone-200" />
                    <div>
                      <p className="font-bold text-stone-900 text-[11px] line-clamp-1">{tool.name}</p>
                      <p className="text-[#1d3a28] text-[10px] font-bold">Rp {tool.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => toggleTool(tool)} className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-stone-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 block font-mono">TOTAL SEWA ALAT</span>
              <span className="text-sm font-extrabold text-[#1d3a28] font-mono">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="bg-[#1d3a28] hover:bg-[#152a1b] text-white px-4 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md border border-[#1d3a28]"
            >
              <span>SELESAIKAN PESANAN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
