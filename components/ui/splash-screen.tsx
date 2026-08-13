"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export function SplashScreen() {
  // Timeline Stages: "entry" -> "fadeText" -> "zoomLogo" -> "dissolveBg" -> "done"
  const [stage, setStage] = React.useState<"entry" | "fadeText" | "zoomLogo" | "dissolveBg" | "done">("entry");

  React.useEffect(() => {
    // Koreografi Urutan Waktu
    const t1 = setTimeout(() => setStage("fadeText"), 1800);   // Tahap 1: Tulisan pudar duluan
    const t2 = setTimeout(() => setStage("zoomLogo"), 2200);   // Tahap 2: Logo membesar & pudar
    const t3 = setTimeout(() => setStage("dissolveBg"), 2800); // Tahap 3: Latar belakang pudar
    const t4 = setTimeout(() => setStage("done"), 3400);       // Tahap 4: Masuk penuh ke website

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (stage === "done") return null;

  const isTextFaded = stage !== "entry";
  const isLogoZoomed = stage === "zoomLogo" || stage === "dissolveBg";
  const isBgDissolved = stage === "dissolveBg";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isBgDissolved ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f4f2eb] text-stone-900 select-none pointer-events-auto"
      >
        {/* Wrapper Logo dengan Efek Zoom-In & Fade */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{
            scale: isLogoZoomed ? 1.5 : 1,
            opacity: isLogoZoomed ? 0 : 1,
            y: 0
          }}
          transition={{
            duration: isLogoZoomed ? 0.7 : 0.9,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo GAMTARA Utuh */}
          <Logo variant="full" height={80} />

          {/* Wrapper Tulisan Subtitle & Garis Emas (Pudar Duluan) */}
          <motion.div
            animate={{ 
              opacity: isTextFaded ? 0 : 1, 
              y: isTextFaded ? -12 : 0 
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-2"
          >
            {/* Garis Emas Flow */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#c5922e] to-transparent mt-2 rounded-full"
            />

            {/* Tulisan Subtitle Lebih Besar & Tegas */}
            <span className="font-mono text-xs sm:text-sm text-stone-800 tracking-[0.25em] font-bold uppercase mt-2">
              Ternate Expedition Platform
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
