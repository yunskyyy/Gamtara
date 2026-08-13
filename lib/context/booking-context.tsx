"use client";

import * as React from "react";

export interface SelectedTool {
  id: string;
  name: string;
  price: number;
  img: string;
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
  guideRequests: GuideRequest[];
  toggleTool: (tool: SelectedTool) => void;
  createGuideRequest: (guide: { id: string; name: string; price: number; avatar: string }, destination: string) => void;
  cancelGuideRequest: (requestId: string) => void;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<SelectedTool[]>([]);
  const [guideRequests, setGuideRequests] = React.useState<GuideRequest[]>([]);

  const toggleTool = (tool: SelectedTool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool]
    );
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
  };

  const totalPrice = React.useMemo(() => {
    return selectedTools.reduce((acc, item) => acc + item.price, 0);
  }, [selectedTools]);

  return (
    <BookingContext.Provider
      value={{ selectedTools, guideRequests, toggleTool, createGuideRequest, cancelGuideRequest, clearBooking, totalPrice }}
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