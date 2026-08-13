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

interface BookingContextType {
  selectedTools: SelectedTool[];
  selectedGuide: SelectedGuide | null;
  toggleTool: (tool: SelectedTool) => void;
  selectGuide: (guide: SelectedGuide | null) => void;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<SelectedTool[]>([]);
  const [selectedGuide, setSelectedGuide] = React.useState<SelectedGuide | null>(null);

  const toggleTool = (tool: SelectedTool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  };

  const selectGuide = (guide: SelectedGuide | null) => {
    setSelectedGuide((prev) => (prev?.id === guide?.id ? null : guide));
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
      value={{ selectedTools, selectedGuide, toggleTool, selectGuide, clearBooking, totalPrice }}
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
