"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { HeroSection } from "@/components/features/landing/hero-section";
import { ToolsCarousel3D } from "@/components/features/landing/tools-carousel-3d";
import { DestinationSections } from "@/components/features/landing/destination-sections";
import { DestinationDetailModal } from "@/components/features/landing/destination-detail-modal";
import { useTourism, DestinationData } from "@/lib/context/tourism-context";

export default function Home() {
  const [selectedDest, setSelectedDest] = React.useState<DestinationData | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f2eb] text-stone-900 selection:bg-stone-900 selection:text-[#f4f2eb]">
      <Navbar />
      <HeroSection />
      <ToolsCarousel3D />
      <DestinationSections onSelectDestination={(dest) => setSelectedDest(dest)} />
      <DestinationDetailModal destination={selectedDest} onClose={() => setSelectedDest(null)} />
    </main>
  );
}