"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { RoomChatModal } from "@/components/features/chat/room-chat-modal";
import { CheckCircle2, MessageSquare, Bell, Store } from "lucide-react";

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"pemilik" | "pemandu">("pemandu");
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL MITRA</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal Mitra GAMTARA</h1>
          </div>

          <div className="flex gap-2 p-1 bg-stone-200 rounded-xl font-bold text-xs">
            <button onClick={() => setActiveTab("pemandu")} className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === "pemandu" ? "bg-[#1d3a28] text-white" : "text-stone-700"}`}>
              Pemandu Wisata
            </button>
            <button onClick={() => setActiveTab("pemilik")} className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === "pemilik" ? "bg-[#1d3a28] text-white" : "text-stone-700"}`}>
              Pemilik Barang
            </button>
          </div>
        </div>

        {activeTab === "pemandu" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-300 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-[#1d3a28]">
                <Bell className="w-4 h-4 text-[#c5922e]" /> Permintaan Dampingan Masuk Dari Klien
              </h3>

              <div className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans">
                <div>
                  <p className="font-bold text-sm text-stone-900">Klien: Wisatawan Subur</p>
                  <p className="text-stone-600"><strong>Tanggal Dampingan:</strong> 15 Juni 2025 - 17 Juni 2025</p>
                  <p className="text-stone-600"><strong>Lokasi Rute:</strong> Pantai Sulamadaha & Danau Tolire</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => alert("Permintaan Disetujui! Notifikasi dikirim ke Klien untuk Pembayaran.")} className="px-4 py-2 bg-[#1d3a28] text-white rounded-xl font-bold uppercase text-[11px] cursor-pointer">
                    Setujui Tanggal & Lokasi
                  </button>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans">
                <div>
                  <p className="font-bold text-sm text-emerald-900 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#1d3a28]" /> Pembayaran Selesai - Klien: Budi Ternate</p>
                  <p className="text-emerald-800">Sesi Room Chat Terbuka untuk Koordinasi Lanjutan.</p>
                </div>
                <button onClick={() => setIsChatOpen(true)} className="px-4 py-2 bg-[#1d3a28] text-white rounded-xl font-bold uppercase text-[11px] cursor-pointer flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat Klien
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pemilik" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-300 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-[#1d3a28]">
                <Store className="w-4 h-4 text-[#c5922e]" /> Pesanan Masuk Dari Penyewa (Pembayaran Selesai)
              </h3>

              <div className="p-4 bg-white border border-stone-300 rounded-xl space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="font-bold text-stone-900 text-sm">Penyewa: Wisatawan Subur</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">LUNAS</span>
                </div>
                <p className="text-stone-600"><strong>Alat Disewa:</strong> Tenda Dome 4P (1 Unit)</p>
                <p className="text-stone-600"><strong>Periode Sewa Jauh Hari:</strong> 15 Juni 2025 - 17 Juni 2025</p>
                <p className="text-stone-600"><strong>Pickup Point:</strong> Toko Gamalama Outdoor (Ternate Tengah)</p>
              </div>
            </div>
          </div>
        )}

        <RoomChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} clientName="Budi Ternate" guideName="Usman Gamalama" />
      </div>
    </main>
  );
}