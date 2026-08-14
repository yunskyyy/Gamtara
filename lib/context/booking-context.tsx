"use client";

import * as React from "react";

export interface ToolOrderItem {
  id: string;
  name: string;
  price: number;
  ownerName: string;
  img: string;
}

export interface StoreOrderGroup {
  orderId: string;
  ownerName: string;
  clientName: string;
  items: ToolOrderItem[];
  totalPrice: number;
  startDate: string;
  endDate: string;
  status: "LUNAS" | "DIGUNAKAN" | "SELESAI";
  photoBefore?: string;
  photoAfter?: string;
}

export interface GuideRequest {
  id: string;
  guideId: string;
  guideName: string;
  clientName: string;
  selectedDestination: string;
  tourDate: string;
  price: number;
  avatar: string;
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "LUNAS";
}

export interface ChatMessage {
  id: string;
  orderOrRequestId: string;
  sender: string;
  text: string;
  time: string;
}

interface BookingContextType {
  selectedTools: ToolOrderItem[];
  storeOrders: StoreOrderGroup[];
  guideRequests: GuideRequest[];
  chatMessages: ChatMessage[];
  toggleTool: (tool: ToolOrderItem) => void;
  createGuideRequest: (guide: { id: string; name: string; price: number; avatar: string }, destination: string, clientName: string, tourDate: string) => void;
  updateGuideStatus: (requestId: string, status: "DISETUJUI" | "DITOLAK" | "LUNAS") => void;
  cancelGuideRequest: (requestId: string) => void;
  completeCheckout: (startDate: string, endDate: string, clientName: string) => void;
  sendChatMessage: (orderOrRequestId: string, sender: string, text: string) => void;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<ToolOrderItem[]>([]);
  const [storeOrders, setStoreOrders] = React.useState<StoreOrderGroup[]>([
    {
      orderId: "ORD-TOKO-7890",
      ownerName: "Toko Gamalama Outdoor",
      clientName: "Wisatawan Subur",
      items: [{ id: "t1", name: "Tenda Dome 4P", price: 50000, ownerName: "Toko Gamalama Outdoor", img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop" }],
      totalPrice: 50000,
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      status: "LUNAS",
    }
  ]);

  const [guideRequests, setGuideRequests] = React.useState<GuideRequest[]>([
    { id: "REQ-901", guideId: "g1", guideName: "Fikri Subur", clientName: "Wisatawan Subur", selectedDestination: "Pantai Sulamadaha", tourDate: "2025-06-15", price: 150000, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop", status: "LUNAS" }
  ]);

  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    { id: "m1", orderOrRequestId: "REQ-901", sender: "Fikri Subur", text: "Halo Klien! Pembayaran telah lunas. Sampai jumpa di titik kumpul!", time: "09:00" },
    { id: "m2", orderOrRequestId: "ORD-TOKO-7890", sender: "Toko Gamalama Outdoor", text: "Halo Penyewa! Alat tenda Anda sudah siap diambil di toko.", time: "09:30" }
  ]);

  const toggleTool = (tool: ToolOrderItem) => {
    setSelectedTools((prev) => prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool]);
  };

  const createGuideRequest = (guide: { id: string; name: string; price: number; avatar: string }, destination: string, clientName: string, tourDate: string) => {
    const newReq: GuideRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      guideId: guide.id,
      guideName: guide.name,
      clientName: clientName || "Wisatawan",
      selectedDestination: destination,
      tourDate: tourDate || "15 Juni 2025",
      price: guide.price,
      avatar: guide.avatar,
      status: "MENUNGGU",
    };
    setGuideRequests((prev) => [...prev, newReq]);
  };

  const updateGuideStatus = (requestId: string, status: "DISETUJUI" | "DITOLAK" | "LUNAS") => {
    setGuideRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status } : r));
  };

  const cancelGuideRequest = (requestId: string) => {
    setGuideRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const completeCheckout = (startDate: string, endDate: string, clientName: string) => {
    const grouped = selectedTools.reduce((acc, item) => {
      acc[item.ownerName] = acc[item.ownerName] || [];
      acc[item.ownerName].push(item);
      return acc;
    }, {} as Record<string, ToolOrderItem[]>);

    const newOrders: StoreOrderGroup[] = Object.entries(grouped).map(([ownerName, items], idx) => ({
      orderId: `ORD-${Date.now().toString().slice(-4)}-${idx + 1}`,
      ownerName,
      clientName: clientName || "Wisatawan",
      items,
      totalPrice: items.reduce((sum, i) => sum + i.price, 0),
      startDate,
      endDate,
      status: "LUNAS",
    }));

    setStoreOrders((prev) => [...newOrders, ...prev]);
    setSelectedTools([]);
  };

  const sendChatMessage = (orderOrRequestId: string, sender: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderOrRequestId,
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const clearBooking = () => setSelectedTools([]);
  const totalPrice = React.useMemo(() => selectedTools.reduce((acc, item) => acc + item.price, 0), [selectedTools]);

  return (
    <BookingContext.Provider
      value={{ selectedTools, storeOrders, guideRequests, chatMessages, toggleTool, createGuideRequest, updateGuideStatus, cancelGuideRequest, completeCheckout, sendChatMessage, clearBooking, totalPrice }}
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