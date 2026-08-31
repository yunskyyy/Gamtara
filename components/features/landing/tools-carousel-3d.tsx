"use client";

import * as React from "react";
import { motion, PanInfo } from "framer-motion";
import { MapPin, ShoppingBag, ArrowLeft, ArrowRight, Check, Star } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useTourism, ToolItem } from "@/lib/context/tourism-context";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { AuthPromptModal } from "@/components/ui/auth-prompt-modal";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["900"], style: ["italic"] });

export function ToolsCarousel3D() {
  const { user } = useAuth();
  const { selectedTools, toggleTool } = useBooking();
  const { tools } = useTourism();
  const [progress, setProgress] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);
  
  const touchStartRef = React.useRef<number | null>(null);
  const total = tools.length;

  React.useEffect(() => {
    if (isHovered || total === 0) return;
    let animId: number;
    const speed = 0.0025;
    const tick = () => { setProgress((prev) => (prev + speed) % total); animId = requestAnimationFrame(tick); };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, total]);

  const handlePan = (_: unknown, info: PanInfo) => {
    if (total === 0) return;
    setProgress((prev) => (prev - info.delta.x * 0.004 % total + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => { setIsHovered(true); touchStartRef.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || total === 0) return;
    const currentX = e.touches[0].clientX;
    const diffX = touchStartRef.current - currentX;
    setProgress((prev) => (prev + diffX * 0.001) % total);
    touchStartRef.current = currentX;
  };
  const handleTouchEnd = () => { touchStartRef.current = null; setIsHovered(false); };

  const handleToolClick = (e: React.MouseEvent, item: ToolItem) => {
    e.stopPropagation();
    if (!user) { setIsPromptOpen(true); return; }
    toggleTool({ id: item.id, name: item.name, price: item.price, ownerName: item.ownerName, img: item.img, vendorId: item.vendorId });
  };

  if (total === 0) return null;

  return (
    <section id="catalog-section" className="relative py-24 bg-[#18221c] text-stone-100 overflow-hidden min-h-[800px] flex flex-col justify-center items-center select-none">
      <div className="relative z-10 text-center mb-12 px-4 max-w-2xl">
        <span className="font-mono text-xs text-[#c5922e] tracking-widest uppercase mb-3 block font-bold">// GEAR PASSPORT CATALOG</span>
        <h2 className={`${playfair.className} text-4xl sm:text-6xl font-black italic tracking-tight text-stone-100 mb-4`}>
          Perlengkapan Outdoor
        </h2>
      </div>

      <motion.div 
        onPan={handlePan} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full max-w-6xl h-[520px] flex items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {tools.map((item, index) => {
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
              animate={{ x: offset * 240, scale: scale, rotateY: offset * -12, opacity: opacity, zIndex: zIndex }}
              transition={{ duration: 0.2, ease: "easeOut" }} style={{ transformStyle: "preserve-3d" }}
              className={`absolute w-[320px] h-[480px] bg-white text-stone-900 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-stone-800 ${absOffset < 0.5 ? "ring-2 ring-[#c5922e]" : "filter brightness-75"}`}
            >
              <div className="relative h-[45%] w-full bg-stone-200 border-b border-stone-300">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-sm text-[10px] font-extrabold text-[#1d3a28] flex items-center gap-1 shadow-sm border border-stone-300">
                  <Star className="w-3 h-3 fill-[#c5922e] text-[#c5922e]" /> {item.rating} ({item.rentCount}x)
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 bg-[#f5f3ec]">
                <h3 className="font-extrabold text-xl text-stone-900 leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">{item.desc}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-extrabold text-[#c5922e] uppercase tracking-wider bg-[#c5922e]/10 px-2 py-1 rounded-sm inline-block border border-[#c5922e]/20">
                    {item.ownerName}
                  </p>
                  <div className="flex justify-between items-center text-[11px] text-stone-600 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#1d3a28]"/> {item.loc}</span>
                    <span className="bg-stone-200 px-2 py-0.5 rounded-sm border border-stone-300">{item.dist}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-center font-mono text-[10px]">
                  <div className="bg-white border border-stone-300 p-1.5 rounded-sm"><span className="text-stone-500 block">KATEGORI</span><span className="font-bold text-[#1d3a28]">{item.category}</span></div>
                  <div className="bg-white border border-stone-300 p-1.5 rounded-sm"><span className="text-stone-500 block">STOK</span><span className="font-bold text-[#1d3a28]">{item.stock} Unit</span></div>
                </div>

                <div className="mt-auto pt-4 border-t border-stone-300 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase tracking-widest font-bold mb-0.5">Sewa / Hari</span>
                    <span className="text-xl font-black text-[#1d3a28]">Rp {item.price.toLocaleString("id-ID")}</span>
                  </div>
                  <button onClick={(e) => handleToolClick(e, item)} className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all cursor-pointer shadow-md border ${isSelected ? "bg-emerald-100 text-[#1d3a28] border-emerald-300" : "bg-[#1d3a28] text-white hover:bg-[#152a1b] border-[#1d3a28]"}`}>
                    {isSelected ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="relative z-10 flex items-center gap-6 mt-10 font-mono text-xs text-stone-400">
        <button onClick={() => setProgress((prev) => (Math.round(prev) - 1 + total) % total)} className="p-3 rounded-sm bg-stone-800/50 hover:bg-stone-700 text-white transition-colors cursor-pointer border border-stone-600"><ArrowLeft className="w-5 h-5" /></button>
        <span className="tracking-widest uppercase font-bold">Geser Kartu</span>
        <button onClick={() => setProgress((prev) => (Math.round(prev) + 1) % total)} className="p-3 rounded-sm bg-stone-800/50 hover:bg-stone-700 text-white transition-colors cursor-pointer border border-stone-600"><ArrowRight className="w-5 h-5" /></button>
      </div>

      <AuthPromptModal isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} onOpenAuth={() => {}} actionText="menyewa peralatan outdoor" />
    </section>
  );
}