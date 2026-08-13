"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { MapPin, ShoppingBag, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { MOCK_TOOLS, ToolItem } from "@/lib/data/mock-tourism-data";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";
import { AuthModal } from "@/components/features/auth/auth-modal";

export function ToolsCarousel3D() {
  const { user } = useAuth();
  const { selectedTools, toggleTool } = useBooking();
  const [progress, setProgress] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  
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
    if (!user) {
      setIsPromptOpen(true);
      return;
    }
    toggleTool(item);
  };

  return (
    <section id="catalog-section" className="relative py-24 bg-[#18221c] text-stone-100 overflow-hidden min-h-[680px] flex flex-col justify-center items-center border-b border-stone-800 select-none">
      <div className="relative z-10 text-center mb-10 px-4 max-w-2xl">
        <span className="font-mono text-xs text-[#c5922e] tracking-widest uppercase mb-2 block">// GEAR PASSPORT CATALOG</span>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">Perlengkapan Outdoor</h2>
        <p className="text-stone-400 text-xs font-mono">Peralatan standar keselamatan untuk eksplorasi pulau Ternate</p>
      </div>

      <motion.div 
        onPan={handlePan}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full max-w-6xl h-[450px] flex items-center justify-center perspective-[1000px] cursor-grab active:cursor-grabbing touch-pan-y"
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
            <motion.div key={item.id} onClick={() => setProgress(index)} animate={{ x: offset * 220, scale: scale, rotateY: offset * -10, opacity: opacity, zIndex: zIndex }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ transformStyle: "preserve-3d" }} className={`absolute w-[280px] sm:w-[320px] bg-[#f5f3ec] text-stone-900 rounded-sm p-5 shadow-2xl border border-stone-800 ${absOffset < 0.5 ? "ring-2 ring-[#c5922e]" : "filter brightness-90"}`}>
              <div className="relative h-44 w-full rounded-sm overflow-hidden mb-4 bg-stone-300 border border-stone-400">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-0.5">{item.name}</h3>
                <div className="flex items-center gap-1 text-stone-600 text-xs mb-3 font-mono">
                  <MapPin className="w-3 h-3 text-[#1d3a28]" />
                  <span>{item.loc}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-stone-200/80 rounded-sm mb-4 text-center font-mono text-[10px] border border-stone-300">
                  <div><span className="text-stone-500 block">DIST</span><span className="font-bold text-[#1d3a28]">{item.dist}</span></div>
                  <div><span className="text-stone-500 block">TEMP</span><span className="font-bold text-sky-800">{item.temp}</span></div>
                  <div><span className="text-stone-500 block">RATING</span><span className="font-bold text-amber-800">{item.rating}★</span></div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-300">
                  <div><span className="text-[10px] text-stone-500 block font-mono">SEWA / HARI</span><span className="text-base font-bold text-stone-900 font-mono">Rp {item.price.toLocaleString("id-ID")}</span></div>
                  <button onClick={(e) => handleToolClick(e, item)} className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors cursor-pointer border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-stone-900 text-stone-100 hover:bg-[#1d3a28] border-stone-800"}`}>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="relative z-10 flex items-center gap-4 mt-6 font-mono text-xs text-stone-400">
        <button onClick={() => setProgress((prev) => (Math.round(prev) - 1 + total) % total)} className="p-2.5 rounded-sm bg-stone-900 text-stone-200 hover:bg-[#1d3a28] transition-colors border border-stone-700"><ArrowLeft className="w-4 h-4" /></button>
        <span>[ SWIPE / HOVER TO PAUSE ]</span>
        <button onClick={() => setProgress((prev) => (Math.round(prev) + 1) % total)} className="p-2.5 rounded-sm bg-stone-900 text-stone-200 hover:bg-[#1d3a28] transition-colors border border-stone-700"><ArrowRight className="w-4 h-4" /></button>
      </div>

      <AuthPromptModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => setIsAuthOpen(true)} actionText="menyewa peralatan outdoor" />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}