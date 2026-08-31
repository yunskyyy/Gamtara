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
    toggleTool({ id: item.id, name: item.name, price: item.price, ownerName: item.ownerName, img: item.img, vendorId: item.vendorId, lat: item.lat, lng: item.lng });
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
  className={`absolute w-[300px] h-[460px] bg-[#f4f2eb] text-stone-900 rounded-sm shadow-2xl border border-stone-800 flex flex-col overflow-hidden ${absOffset < 0.5 ? "ring-2 ring-[#1d3a28]" : "filter brightness-75"}`}
>
  {/* FOKUS UTAMA: Gambar Mendominasi 65% Kartu & Dicrop Konsisten */}
  <div className="relative h-[65%] w-full bg-stone-200 border-b border-stone-800">
    <img src={item.img} alt={item.name} className="w-full h-full object-cover pointer-events-none" />
    <div className="absolute top-3 left-3 bg-[#f4f2eb] px-2.5 py-1 rounded-sm text-[10px] font-bold text-[#1d3a28] flex items-center gap-1 border border-stone-800">
      ★ {item.rating} ({item.rentCount}x)
    </div>
  </div>

  {/* KONTEN TEKS: Dirapatkan & Minimalis */}
  <div className="p-4 flex flex-col flex-1 justify-between">
    <div>
      <h3 className="font-extrabold text-stone-900 text-lg leading-tight truncate">{item.name}</h3>
      <p className="text-[#c5922e] text-[10px] font-bold uppercase tracking-wider mt-1 truncate">{item.ownerName}</p>
    </div>

    <div className="grid grid-cols-2 gap-2 text-center font-mono text-[9px] border-y border-stone-300 py-2 my-2">
      <div><span className="text-stone-500 block">KATEGORI</span><span className="font-bold text-[#1d3a28]">{item.category}</span></div>
      <div><span className="text-stone-500 block">STOK</span><span className="font-bold text-[#1d3a28]">{item.stock} Unit</span></div>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <span className="text-[9px] text-stone-500 block font-mono uppercase">Sewa / Hari</span>
        <span className="text-lg font-black text-[#1d3a28]">Rp {item.price.toLocaleString("id-ID")}</span>
      </div>
      <button onClick={(e) => handleToolClick(e, item)} className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors cursor-pointer border ${isSelected ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-transparent text-stone-900 hover:bg-stone-200 border-stone-900"}`}>
        {isSelected ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
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
