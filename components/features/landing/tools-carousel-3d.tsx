"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { MapPin, ShoppingBag, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { MOCK_TOOLS, ToolItem } from "@/lib/data/mock-tourism-data";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["italic"] });

export function ToolsCarousel3D() {
  const { user } = useAuth();
  const { selectedTools, toggleTool } = useBooking();
  const [progress, setProgress] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);
  
  const touchStartRef = React.useRef<number | null>(null);
  const total = MOCK_TOOLS.length;

  React.useEffect(() => {
    if (isHovered) return;
    let animId: number;
    const speed = 0.0025;
    const tick = () => { setProgress((prev) => (prev + speed) % total); animId = requestAnimationFrame(tick); };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, total]);

  const handlePan = (_: unknown, info: PanInfo) => {
    setProgress((prev) => (prev - info.delta.x * 0.004 % total + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = touchStartRef.current - currentX;
    setProgress((prev) => (prev + diffX * 0.001) % total);
    touchStartRef.current = currentX;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsHovered(false);
  };

  const handleToolClick = (e: React.MouseEvent, item: ToolItem) => {
    e.stopPropagation();
    if (!user) { setIsPromptOpen(true); return; }
    toggleTool(item);
  };

  return (
    <section id="catalog-section" className="relative py-20 bg-[#18221c] text-stone-100 overflow-hidden min-h-[660px] flex flex-col justify-center items-center border-b border-stone-800 select-none">
      <div className="relative z-10 text-center mb-8 px-4 max-w-2xl">
        <h2 className={`${playfair.className} text-4xl sm:text-5xl font-black italic tracking-tight text-white mb-2`}>
          Perlengkapan Outdoor
        </h2>
        <p className="text-stone-400 text-sm font-light">Sewa peralatan keselamatan terbaik untuk petualanganmu di Ternate</p>
      </div>

      <motion.div 
        onPan={handlePan} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full max-w-6xl h-[440px] flex items-center justify-center perspective-[1000px] cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {MOCK_TOOLS.map((item, index) => {
          let rawOffset = index - progress;
          let offset = ((rawOffset % total) + total) % total;
          if (offset > total / 2) offset -= total;

          const absOffset = Math.abs(offset);
          let opacity = absOffset < 0.8 ? 1 : absOffset < 2.2 ? (2.2 - absOffset) / 1.4 : 0;
          const scale = Math.max(0.65, 1 - absOffset * 0.16);
          const zIndex = Math.round(100 - absOffset * 20);
          const isSelected = selectedTools.some((t) => t.id === item.id);

          return (
            <motion.div
              key={item.id} onClick={() => setProgress(index)}
              animate={{ x: offset * 220, scale: scale, rotateY: offset * -10, opacity: opacity, zIndex: zIndex }}
              transition={{ duration: 0.2, ease: "easeOut" }} style={{ transformStyle: "preserve-3d" }}
              className={`absolute w-[280px] sm:w-[320px] bg-[#f4f2eb] text-stone-900 rounded-xl p-5 shadow-2xl border border-stone-300 ${absOffset < 0.5 ? "ring-2 ring-[#1d3a28] shadow-black/80" : "filter brightness-90"}`}
            >
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-stone-200">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-0.5">{item.name}</h3>
                <div className="flex items-center gap-1 text-stone-600 text-xs mb-3 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#1d3a28]" /> <span>{item.loc}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-stone-200/70 rounded-xl mb-4 text-center font-mono text-[10px]">
                  <div><span className="text-stone-500 block font-medium">Jarak</span><span className="font-bold text-[#1d3a28] text-[11px]">{item.dist}</span></div>
                  <div><span className="text-stone-500 block font-medium">Suhu</span><span className="font-bold text-sky-800 text-[11px]">{item.temp}</span></div>
                  <div><span className="text-stone-400 block font-medium">Rating</span><span className="font-bold text-amber-700 text-[11px]">{item.rating}★</span></div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-300">
                  <div><span className="text-[10px] text-stone-500 block font-medium">Harga / Hari</span><span className="text-base font-extrabold text-stone-900">Rp {item.price.toLocaleString("id-ID")}</span></div>
                  <button onClick={(e) => handleToolClick(e, item)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-stone-900 text-white hover:bg-[#1d3a28] border-stone-900"}`}>
                    {isSelected ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="relative z-10 flex items-center gap-4 mt-6 font-sans text-xs text-stone-400">
        <button onClick={() => setProgress((prev) => (Math.round(prev) - 1 + total) % total)} className="p-2.5 rounded-xl bg-stone-900 text-stone-200 hover:bg-[#1d3a28] transition-colors"><ArrowLeft className="w-4 h-4" /></button>
        <span>Geser untuk melihat peralatan lainnya</span>
        <button onClick={() => setProgress((prev) => (Math.round(prev) + 1) % total)} className="p-2.5 rounded-xl bg-stone-900 text-stone-200 hover:bg-[#1d3a28] transition-colors"><ArrowRight className="w-4 h-4" /></button>
      </div>

      <AuthPromptModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => {}} actionText="menyewa peralatan outdoor" />
    </section>
  );
}