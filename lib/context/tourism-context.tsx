"use client";

import * as React from "react";
import { fetchRealTools, fetchRealGuides } from "@/services/tourism-service";

export interface ToolItem {
  id: string; name: string; desc: string; category: string; price: number; stock: number;
  vendorId: string; ownerName: string; vendorName: string; loc: string; location: string;
  dist: string; temp: string; rating: string; rentCount: number; lat: number; lng: number; img: string;
}

export interface GuideItem {
  id: string; name: string; desc: string; lang: string; origin: string; address: string; gender: "Laki-laki" | "Perempuan";
  specialtySpot?: string; specialtySpots: string[]; status: "available" | "busy" | "Tersedia" | "Sibuk";
  price: number; rating: number; completedTours: number; avatar: string;
}

export interface DestinationData {
  id: string; title: string; tag: string; desc: string; img: string; suggestedTools: ToolItem[]; guides: GuideItem[];
}

const STATIC_DESTINATIONS: DestinationData[] = [
  { id: "sulamadaha", title: "Pantai Sulamadaha", tag: "Bahari & Kaca Alami", desc: "Laut tenang sejernih kaca.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop", suggestedTools: [], guides: [] },
  { id: "tolire", title: "Danau Tolire Unik", tag: "Wisata Legenda Vulkanik", desc: "Danau raksasa hijau di bawah Kaki Gamalama.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop", suggestedTools: [], guides: [] },
  { id: "maitara", title: "Pulau Maitara & Tidore", tag: "Ikonik Uang Seribu", desc: "Pemandangan legendaris pecahan uang seribu rupiah.", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop", suggestedTools: [], guides: [] },
];

interface TourismContextType { tools: ToolItem[]; guides: GuideItem[]; destinations: DestinationData[]; isLoading: boolean; }
const TourismContext = React.createContext<TourismContextType | undefined>(undefined);

export function TourismProvider({ children }: { children: React.ReactNode }) {
  const [tools, setTools] = React.useState<ToolItem[]>([]);
  const [guides, setGuides] = React.useState<GuideItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [toolsData, guidesData] = await Promise.all([fetchRealTools(), fetchRealGuides()]);
        if (toolsData) setTools(toolsData as ToolItem[]);
        if (guidesData) setGuides(guidesData as GuideItem[]);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    }
    
    loadData();

    // FIX: Auto-Refresh Data (Polling) setiap 15 detik di background
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const destinations = React.useMemo(() => {
    return STATIC_DESTINATIONS.map(dest => ({ ...dest, suggestedTools: tools.slice(0, 2), guides: guides.filter(g => g.specialtySpots.includes(dest.title)).slice(0, 2) }));
  }, [tools, guides]);

  return <TourismContext.Provider value={{ tools, guides, destinations, isLoading }}>{children}</TourismContext.Provider>;
}

export function useTourism() {
  const context = React.useContext(TourismContext);
  if (!context) throw new Error("useTourism must be used within TourismProvider");
  return context;
}