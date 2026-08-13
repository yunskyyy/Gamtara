"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/context/booking-context";
import { ShoppingBag, ArrowRight, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";

export function FloatingCartBar() {
  const { selectedTools, selectedGuide, toggleTool, selectGuide, totalPrice, clearBooking } = useBooking();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasItems = selectedTools.length > 0 || selectedGuide !== null;

  if (!hasItems) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50 pointer-events-none w-80 sm:w-96 font-mono text-xs"
      >
        <div className="pointer-events-auto bg-[#f9f8f3] border border-stone-300 text-stone-900 rounded-sm p-4 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1d3a28]" />
              <span className="font-extrabold tracking-wider uppercase text-stone-900">KERANJANG EKSPEDISI</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:text-[#1d3a28] cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={clearBooking}
                className="p-1 hover:text-rose-600 cursor-pointer"
                title="Kosongkan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List Items */}
          {isExpanded && (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 mb-3">
              {selectedTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between bg-white p-2 rounded-sm border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <img src={tool.img} alt={tool.name} className="w-8 h-8 rounded-sm object-cover border border-stone-200" />
                    <div>
                      <p className="font-bold text-stone-900 text-[11px] line-clamp-1">{tool.name}</p>
                      <p className="text-[#1d3a28] text-[10px] font-bold">Rp {tool.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {selectedGuide && (
                <div className="flex items-center justify-between bg-[#1d3a28]/10 p-2 rounded-sm border border-[#1d3a28]/30">
                  <div className="flex items-center gap-2.5">
                    <img src={selectedGuide.avatar} alt={selectedGuide.name} className="w-8 h-8 rounded-full object-cover border border-[#1d3a28]" />
                    <div>
                      <p className="font-bold text-stone-900 text-[11px] line-clamp-1">{selectedGuide.name} (Guide)</p>
                      <p className="text-[#1d3a28] text-[10px] font-bold">Rp {selectedGuide.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectGuide(null)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Total & Checkout */}
          <div className="pt-2 border-t border-stone-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 block font-mono">TOTAL BIAYA</span>
              <span className="text-sm font-extrabold text-[#1d3a28] font-mono">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <button
              type="button"
              onClick={() => alert(`Checkout Transaksi Senilai: Rp ${totalPrice.toLocaleString("id-ID")}`)}
              className="bg-[#1d3a28] hover:bg-[#152a1b] text-white px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md border border-[#1d3a28]"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
