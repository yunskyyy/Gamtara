"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface ToolOrderItem { id: string; name: string; price: number; ownerName: string; img: string; vendorId: string; lat: number; lng: number; }
export interface StoreOrderGroup { orderId: string; ownerName: string; clientName: string; items: ToolOrderItem[]; totalPrice: number; startDate: string; endDate: string; status: "LUNAS" | "DIGUNAKAN" | "SELESAI" | "SENGKETA"; photoBefore?: string; photoAfter?: string; }
export interface GuideRequest { id: string; guideId: string; guideName: string; clientName: string; selectedDestination: string; tourDate: string; price: number; avatar: string; status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "LUNAS" | "SELESAI"; }
export interface ChatMessage { id: string; orderOrRequestId: string; sender: string; text: string; time: string; }
export interface DisputeItem { id: string; orderId: string; itemName: string; ownerName: string; clientName: string; photoBefore: string; photoAfter: string; claimAmount: number; status: "INVESTIGASI" | "DISETUJUI" | "DITOLAK"; }
export interface PayoutItem { id: string; partnerName: string; role: string; amount: number; status: "SCHEDULED" | "PAID"; }

export interface BookingContextType {
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
  completeCheckout: (startDate: string, endDate: string, clientName: string, userId: string, totalDays: number) => Promise<boolean>;
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
  const [isLoaded, setIsLoaded] = React.useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  React.useEffect(() => {
    const loadState = () => {
      const db = localStorage.getItem("gamtara_db");
      if (db) {
        const parsed = JSON.parse(db);
        setSelectedTools(parsed.selectedTools || []);
        setStoreOrders(parsed.storeOrders || []);
        setGuideRequests(parsed.guideRequests || []);
        setChatMessages(parsed.chatMessages || []);
        setDisputes(parsed.disputes || []);
        setPayouts(parsed.payouts || []);
      }
      setIsLoaded(true);
    };
    loadState();
    const interval = setInterval(() => loadState(), 3000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gamtara_db", JSON.stringify({ selectedTools, storeOrders, guideRequests, chatMessages, disputes, payouts }));
    }
  }, [selectedTools, storeOrders, guideRequests, chatMessages, disputes, payouts, isLoaded]);

  const toggleTool = (tool: ToolOrderItem) => setSelectedTools((prev) => prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool]);
  const clearBooking = () => setSelectedTools([]);

  const completeCheckout = async (startDate: string, endDate: string, clientName: string, userId: string, totalDays: number) => {
    if (!userId || selectedTools.length === 0) return false;
    const grouped = selectedTools.reduce((acc, item) => {
      acc[item.ownerName] = acc[item.ownerName] || [];
      acc[item.ownerName].push(item);
      return acc;
    }, {} as Record<string, ToolOrderItem[]>);

    try {
      const newOrders: StoreOrderGroup[] = [];
      for (const [ownerName, items] of Object.entries(grouped)) {
        const totalPrice = items.reduce((sum, i) => sum + (i.price * totalDays), 0);
        const token = `TRX-${Date.now().toString().slice(-6)}`;
        const vendorId = items[0].vendorId;

        const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert([{
          customer_id: userId, vendor_id: vendorId, total_amount: totalPrice, status: "LUNAS", qr_code_token: token, start_date: startDate, end_date: endDate
        }]).select("id").single();

        if (bookingError) { alert("Gagal membuat pesanan: " + bookingError.message); return false; }

        if (bookingData) {
          for (const item of items) {
            await supabase.from("booking_tool_items").insert([{ booking_id: bookingData.id, tool_id: item.id, start_date: startDate, end_date: endDate }]);
            const { data: toolData } = await supabase.from("tools").select("stock, rent_count").eq("id", item.id).single();
            if (toolData && toolData.stock > 0) {
              await supabase.from("tools").update({ stock: toolData.stock - 1, rent_count: (toolData.rent_count || 0) + 1 }).eq("id", item.id);
            }
          }
        }
        newOrders.push({ orderId: token, ownerName, clientName, items, totalPrice, startDate, endDate, status: "LUNAS" });
      }
      setStoreOrders((prev) => [...newOrders, ...prev]);
      setSelectedTools([]);
      return true;
    } catch (err) {
      alert("Terjadi kesalahan sistem saat checkout.");
      return false;
    }
  };

  const createGuideRequest = (guide: { id: string; name: string; price: number; avatar: string }, destination: string, clientName: string, tourDate: string) => {
    setGuideRequests((prev) => [...prev, { id: `REQ-${Date.now().toString().slice(-4)}`, guideId: guide.id, guideName: guide.name, clientName, selectedDestination: destination, tourDate, price: guide.price, avatar: guide.avatar, status: "MENUNGGU" }]);
  };

  const updateGuideStatus = (requestId: string, status: "DISETUJUI" | "DITOLAK" | "LUNAS" | "SELESAI") => setGuideRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status } : r));
  const payGuideRequest = (requestId: string) => updateGuideStatus(requestId, "LUNAS");
  const cancelGuideRequest = (requestId: string) => setGuideRequests((prev) => prev.filter((r) => r.id !== requestId));

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
  };

  const reportDamageDispute = (orderId: string, photoBefore: string, photoAfter: string, claimAmount: number) => {
    const ord = storeOrders.find((o) => o.orderId === orderId);
    if (!ord) return;
    setStoreOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: "SENGKETA" } : o));
    setDisputes((prev) => [...prev, { id: `DISP-${Date.now().toString().slice(-4)}`, orderId, itemName: ord.items.map((i) => i.name).join(", "), ownerName: ord.ownerName, clientName: ord.clientName, photoBefore, photoAfter, claimAmount, status: "INVESTIGASI" }]);
  };

  const resolveDispute = (disputeId: string, action: "DISETUJUI" | "DITOLAK") => setDisputes((prev) => prev.map((d) => d.id === disputeId ? { ...d, status: action } : d));

  const sendChatMessage = (orderOrRequestId: string, sender: string, text: string) => {
    setChatMessages((prev) => [...prev, { id: `msg-${Date.now()}`, orderOrRequestId, sender, text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
  };

  const totalPrice = React.useMemo(() => selectedTools.reduce((acc, item) => acc + item.price, 0), [selectedTools]);

  return (
    <BookingContext.Provider value={{ selectedTools, storeOrders, guideRequests, chatMessages, disputes, payouts, toggleTool, createGuideRequest, updateGuideStatus, payGuideRequest, cancelGuideRequest, completeCheckout, updateStoreOrderStatus, reportDamageDispute, resolveDispute, sendChatMessage, clearBooking, totalPrice }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
