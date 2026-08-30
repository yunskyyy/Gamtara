"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { createBrowserClient } from "@supabase/ssr";

export default function PemilikDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      // 1. Cari ID Vendor milik user ini
      const { data: vendor } = await supabase.from("vendors").select("id").eq("profile_id", user.id).single();
      
      if (vendor) {
        // 2. Tarik semua pesanan (bookings) yang masuk ke toko ini beserta data penyewanya
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*, profiles(full_name)")
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });
          
        if (bookings) setOrders(bookings);
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, [user]);

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Toko</h1>
        </div>

        <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2">
            // PESANAN MASUK DARI DATABASE SUPABASE
          </h3>
          
          {isLoading ? (
            <p className="text-xs text-stone-500 font-mono py-2">Memuat data pesanan...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-2">Belum ada pesanan masuk.</p>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-none flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-sm text-stone-900">Penyewa: {ord.profiles?.full_name}</p>
                  <p className="text-stone-600 font-mono">Token: {ord.qr_code_token} • Jadwal: {ord.start_date} s/d {ord.end_date}</p>
                  <span className="font-bold text-[#1d3a28] mt-1 inline-block">Status: {ord.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#c5922e] font-mono">Rp {Number(ord.total_amount).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}