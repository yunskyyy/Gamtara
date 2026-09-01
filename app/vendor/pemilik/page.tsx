"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { useTourism } from "@/lib/context/tourism-context";
import { MessageSquare, Plus, Pencil, Trash2, ShieldAlert, Store, Camera, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { VendorCheckinModal } from "@/components/features/vendor/checkin-modal";
import { VendorCheckoutInspectionModal } from "@/components/features/vendor/checkout-inspection-modal";

export default function PemilikDashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { tools } = useTourism();
  
  const [activeTab, setActiveTab] = React.useState<"pesanan" | "katalog">("pesanan");
  const [vendorName, setVendorName] = React.useState<string>("");
  const [realOrders, setRealOrders] = React.useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  // Modal States
  const [checkinOrder, setCheckinOrder] = React.useState<any>(null);
  const [checkoutOrder, setCheckoutOrder] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchVendorDataAndOrders() {
      if (!user?.id) return;
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: vendor } = await supabase.from("vendors").select("id, business_name").eq("profile_id", user.id).single();
      if (vendor) {
        setVendorName(vendor.business_name);
        const { data: bookings } = await supabase.from("bookings").select("*, customer:profiles!customer_id(full_name)").eq("vendor_id", vendor.id).order("created_at", { ascending: false });
        if (bookings) setRealOrders(bookings);
      }
      setIsLoadingOrders(false);
    }
    fetchVendorDataAndOrders();
  }, [user]);

  if (isLoaded && (!user || user.role !== "vendor")) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-none border border-stone-300 shadow-lg mt-12 space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Ditolak</h2>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider cursor-pointer">Kembali ke Beranda</button>
        </div>
      </main>
    );
  }

  const myTools = tools.filter((t) => t.ownerName === vendorName);

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL TOKO ALAT</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal {vendorName || "Pemilik Barang"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("pesanan")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-none border ${activeTab === "pesanan" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Pesanan Masuk</button>
            <button onClick={() => setActiveTab("katalog")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-none border ${activeTab === "katalog" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Kelola Katalog Alat</button>
          </div>
        </div>

        {activeTab === "pesanan" && (
          <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#c5922e]" /> // MANAJEMEN PESANAN & SERAH TERIMA
            </h3>
            {isLoadingOrders ? (
              <p className="text-xs text-stone-500 font-mono py-2">Memuat data pesanan dari database...</p>
            ) : realOrders.length === 0 ? (
              <p className="text-xs text-stone-500 font-mono py-2">Belum ada pesanan aktif masuk dari penyewa.</p>
            ) : (
              realOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-none flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-sm text-stone-900">Penyewa: {ord.customer?.full_name || "Wisatawan"}</p>
                    <p className="text-stone-600 font-mono">Token: {ord.qr_code_token} • Jadwal: {ord.start_date} s/d {ord.end_date}</p>
                    <span className="font-bold text-[#1d3a28] mt-1 inline-block uppercase">Status: {ord.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCheckinOrder({ orderId: ord.qr_code_token, clientName: ord.customer?.full_name, items: [{name: "Tenda Dome 4P"}] })} className="px-4 py-2 bg-[#c5922e] text-stone-900 text-xs font-bold uppercase font-mono rounded-none cursor-pointer">
                      Check-In (Serah)
                    </button>
                    <button onClick={() => setCheckoutOrder({ orderId: ord.qr_code_token })} className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase font-mono rounded-none cursor-pointer">
                      Check-Out (Kembali)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "katalog" && (
          <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
             <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28]">// DAFTAR ALAT SEWA SAYA</h3>
                <button className="px-4 py-2 bg-[#1d3a28] text-white font-mono text-xs font-bold uppercase rounded-none flex items-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Tambah Alat Baru</button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {myTools.map((t) => (
                 <div key={t.id} className="flex gap-4 p-3 border border-stone-200 bg-[#f4f2eb] rounded-none items-center">
                   <img src={t.img} className="w-16 h-16 rounded-none object-cover border border-stone-300" />
                   <div className="flex-1 text-xs">
                     <p className="font-bold text-sm text-stone-900">{t.name}</p>
                     <p className="text-stone-600 font-mono">Stok: {t.stock} | Rp {t.price.toLocaleString("id-ID")}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        <VendorCheckinModal isOpen={!!checkinOrder} onClose={() => setCheckinOrder(null)} order={checkinOrder} />
        <VendorCheckoutInspectionModal isOpen={!!checkoutOrder} onClose={() => setCheckoutOrder(null)} order={checkoutOrder} />
      </div>
    </main>
  );
}
