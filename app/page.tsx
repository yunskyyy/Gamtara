"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { HeroSection } from "@/components/features/landing/hero-section";
import { ToolsCarousel3D } from "@/components/features/landing/tools-carousel-3d";
import { DestinationSections } from "@/components/features/landing/destination-sections";
import { DestinationDetailModal } from "@/components/features/landing/destination-detail-modal";
import { DestinationData } from "@/lib/data/mock-tourism-data";

export default function Home() {
  const [selectedDest, setSelectedDest] = React.useState<DestinationData | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f2eb] text-stone-900 selection:bg-emerald-800 selection:text-stone-100">
      <Navbar />
      <HeroSection />
      <ToolsCarousel3D />
      
      {/* Destination Sections - Human Editorial Magazine Style */}
      <DestinationSections onSelectDestination={(dest) => setSelectedDest(dest)} />

      {/* Modal Detail & Guide Recommendation */}
      <DestinationDetailModal 
        destination={selectedDest} 
        onClose={() => setSelectedDest(null)} 
      />
    </main>
  );
}