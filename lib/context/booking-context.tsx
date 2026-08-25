"use client";

import * as React from "react";

export interface ToolOrderItem { id: string; name: string; price: number; ownerName: string; img: string; }
export interface StoreOrderGroup { orderId: string; ownerName: string; clientName: string; items: ToolOrderItem[]; totalPrice: number; startDate: string; endDate: string; status: "LUNAS" | "DIGUNAKAN" | "SELESAI" | "SENGKETA"; photoBefore?: string; photoAfter?: string; }
export interface GuideRequest { id: string; guideId: string; guideName: string; clientName: string; selectedDestination: string; tourDate: string; price: number; avatar: string; status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "LUNAS" | "SELESAI"; }
export interface ChatMessage { id: string; orderOrRequestId: string; sender: string; text: string; time: string; }
export interface DisputeItem { id: string; orderId: string; itemName: string; ownerName: string; clientName: string; photoBefore: string; photoAfter: string; claimAmount: number; status: "INVESTIGASI" | "DISETUJUI" | "DITOLAK"; }
export interface PayoutItem { id: string; partnerName: string; role: string; amount: number; status: "SCHEDULED" | "PAID"; }

interface BookingContextType {
  selectedTools: ToolOrderItem[];
  storeOrders: StoreOrderGroup[];
  guideRequests: GuideRequest[];
  chatMessages: ChatMessage[];
  disputes: DisputeItem[];
  payouts: PayoutItem[];
  toggleTool: (tool: ToolOrderItem) => void;
  createGuideRequest: (guide: { id: string; name: string; price: number; avatar: string }, destination: string, clientName: string, tourDate: string) => void;
  updateGuideStatus: (requestId: string, status: "DISETUJUI" | "DITOLAK" | "LUNAS" | "SELESAI") => void;
  payGuideRequest: (requestId: string) => void;
  cancelGuideRequest: (requestId: string) => void;
  completeCheckout: (startDate: string, endDate: string, clientName: string) => void;
  updateStoreOrderStatus: (orderId: string, status: "DIGUNAKAN" | "SELESAI", photoBefore?: string, photoAfter?: string) => void;
  reportDamageDispute: (orderId: string, photoBefore: string, photoAfter: string, claimAmount: number) => void;
  resolveDispute: (disputeId: string, action: "DISETUJUI" | "DITOLAK") => void;
  sendChatMessage: (orderOrRequestId: string, sender: string, text: string) => void;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<ToolOrderItem[]>([]);
  const [storeOrders, setStoreOrders] = React.useState<StoreOrderGroup[]>([]);
  const [guideRequests, setGuideRequests] = React.useState<GuideRequest[]>([]);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [disputes, setDisputes] = React.useState<DisputeItem[]>([]);
  const [payouts, setPayouts] = React.useState<PayoutItem[]>([]);

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

  const updateGuideStatus = (requestId: string, status: "DISETUJUI" | "DITOLAK" | "LUNAS" | "SELESAI") => {
    setGuideRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status } : r));
    if (status === "SELESAI") {
      const req = guideRequests.find((r) => r.id === requestId);
      if (req) {
        setPayouts((prev) => [...prev, { id: `PAY-${Date.now().toString().slice(-4)}`, partnerName: req.guideName, role: "Pemandu Wisata", amount: req.price, status: "SCHEDULED" }]);
      }
    }
  };

  const payGuideRequest = (requestId: string) => {
    updateGuideStatus(requestId, "LUNAS");
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

  const updateStoreOrderStatus = (orderId: string, status: "DIGUNAKAN" | "SELESAI", photoBefore?: string, photoAfter?: string) => {
    setStoreOrders((prev) => prev.map((o) => {
      if (o.orderId === orderId) {
        const updated = { ...o, status };
        if (photoBefore) updated.photoBefore = photoBefore;
        if (photoAfter) updated.photoAfter = photoAfter;
        return updated;
      }
      return o;
    }));

    if (status === "SELESAI") {
      const ord = storeOrders.find((o) => o.orderId === orderId);
      if (ord) {
        setPayouts((prev) => [...prev, { id: `PAY-${Date.now().toString().slice(-4)}`, partnerName: ord.ownerName, role: "Pemilik Barang", amount: ord.totalPrice, status: "SCHEDULED" }]);
      }
    }
  };

  const reportDamageDispute = (orderId: string, photoBefore: string, photoAfter: string, claimAmount: number) => {
    const ord = storeOrders.find((o) => o.orderId === orderId);
    if (!ord) return;

    setStoreOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: "SENGKETA" } : o));
    setDisputes((prev) => [
      ...prev,
      {
        id: `DISP-${Date.now().toString().slice(-4)}`,
        orderId,
        itemName: ord.items.map((i) => i.name).join(", "),
        ownerName: ord.ownerName,
        clientName: ord.clientName,
        photoBefore: photoBefore || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop",
        photoAfter: photoAfter || "https://images.unsplash.com/photo-1504280390467-336c18bf2288?w=400&auto=format&fit=crop",
        claimAmount,
        status: "INVESTIGASI",
      }
    ]);
  };

  const resolveDispute = (disputeId: string, action: "DISETUJUI" | "DITOLAK") => {
    setDisputes((prev) => prev.map((d) => d.id === disputeId ? { ...d, status: action } : d));
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
      value={{
        selectedTools, storeOrders, guideRequests, chatMessages, disputes, payouts,
        toggleTool, createGuideRequest, updateGuideStatus, payGuideRequest, cancelGuideRequest,
        completeCheckout, updateStoreOrderStatus, reportDamageDispute, resolveDispute,
        sendChatMessage, clearBooking, totalPrice
      }}
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