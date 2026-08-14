"use client";

import * as React from "react";

export interface SelectedTool {
  id: string;
  name: string;
  price: number;
  img: string;
}

export interface SelectedGuide {
  id: string;
  name: string;
  price: number;
  avatar: string;
}

export interface GuideRequest {
  id: string;
  guideId: string;
  guideName: string;
  selectedDestination: string;
  price: number;
  avatar: string;
  status: "menunggu_konfirmasi" | "disetujui" | "lunas";
}

interface BookingContextType {
  selectedTools: SelectedTool[];
  selectedGuide: SelectedGuide | null;
  guideRequests: GuideRequest[];
  toggleTool: (tool: SelectedTool) => void;
  selectGuide: (guide: SelectedGuide | null) => void;
  createGuideRequest: (guide: { id: string; name: string; price: number; avatar: string }, destination: string) => void;
  cancelGuideRequest: (requestId: string) => void;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<SelectedTool[]>([]);
  const [selectedGuide, setSelectedGuide] = React.useState<SelectedGuide | null>(null);
  const [guideRequests, setGuideRequests] = React.useState<GuideRequest[]>([]);

  const toggleTool = (tool: SelectedTool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool]
    );
  };

  const selectGuide = (guide: SelectedGuide | null) => {
    setSelectedGuide(guide);
  };

  const createGuideRequest = (guide: { id: string; name: string; price: number; avatar: string }, destination: string) => {
    const newReq: GuideRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      guideId: guide.id,
      guideName: guide.name,
      selectedDestination: destination,
      price: guide.price,
      avatar: guide.avatar,
      status: "menunggu_konfirmasi",
    };
    setGuideRequests((prev) => [...prev, newReq]);
  };

  const cancelGuideRequest = (requestId: string) => {
    setGuideRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const clearBooking = () => {
    setSelectedTools([]);
    setSelectedGuide(null);
  };

  const totalPrice = React.useMemo(() => {
    const toolsTotal = selectedTools.reduce((acc, item) => acc + item.price, 0);
    const guideTotal = selectedGuide ? selectedGuide.price : 0;
    return toolsTotal + guideTotal;
  }, [selectedTools, selectedGuide]);

  return (
    <BookingContext.Provider
      value={{ selectedTools, selectedGuide, guideRequests, toggleTool, selectGuide, createGuideRequest, cancelGuideRequest, clearBooking, totalPrice }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}