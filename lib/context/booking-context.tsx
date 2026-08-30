"use client";

import * as React from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface ToolOrderItem { id: string; name: string; price: number; ownerName: string; img: string; vendorId: string; }

interface BookingContextType {
  selectedTools: ToolOrderItem[];
  toggleTool: (tool: ToolOrderItem) => void;
  completeCheckout: (startDate: string, endDate: string, userId: string, totalDays: number) => Promise<boolean>;
  clearBooking: () => void;
  totalPrice: number;
}

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = React.useState<ToolOrderItem[]>([]);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const toggleTool = (tool: ToolOrderItem) => setSelectedTools((prev) => prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool]);
  const clearBooking = () => setSelectedTools([]);

  // LOGIKA CHECKOUT DATABASE MURNI
  const completeCheckout = async (startDate: string, endDate: string, userId: string, totalDays: number) => {
    if (!userId || selectedTools.length === 0) return false;

    // Grouping berdasarkan vendorId asli dari database
    const grouped = selectedTools.reduce((acc, item) => {
      acc[item.vendorId] = acc[item.vendorId] || [];
      acc[item.vendorId].push(item);
      return acc;
    }, {} as Record<string, ToolOrderItem[]>);

    try {
      for (const [vendorId, items] of Object.entries(grouped)) {
        const totalPrice = items.reduce((sum, i) => sum + (i.price * totalDays), 0);
        const token = `TRX-${Date.now().toString().slice(-6)}`;

        // 1. Insert ke tabel bookings
        const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert([{
          customer_id: userId,
          vendor_id: vendorId,
          total_amount: totalPrice,
          status: "LUNAS",
          qr_code_token: token,
          start_date: startDate,
          end_date: endDate
        }]).select("id").single();

        if (bookingError) {
          alert("Gagal membuat pesanan di database: " + bookingError.message);
          return false;
        }

        // 2. Insert ke booking_tool_items & Kurangi Stok
        for (const item of items) {
          await supabase.from("booking_tool_items").insert([{
            booking_id: bookingData.id, tool_id: item.id, start_date: startDate, end_date: endDate
          }]);

          const { data: toolData } = await supabase.from("tools").select("stock, rent_count").eq("id", item.id).single();
          if (toolData && toolData.stock > 0) {
            await supabase.from("tools").update({ stock: toolData.stock - 1, rent_count: (toolData.rent_count || 0) + 1 }).eq("id", item.id);
          }
        }
      }
      setSelectedTools([]);
      return true;
    } catch (err) {
      alert("Terjadi kesalahan sistem saat checkout.");
      return false;
    }
  };

  const totalPrice = React.useMemo(() => selectedTools.reduce((acc, item) => acc + item.price, 0), [selectedTools]);

  return (
    <BookingContext.Provider value={{ selectedTools, toggleTool, completeCheckout, clearBooking, totalPrice }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}