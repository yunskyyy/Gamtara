"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { Camera, CheckCircle2, MessageSquare, Upload, Plus, Pencil, Trash2 } from "lucide-react";
import { useTourism } from "@/lib/context/tourism-context";

export default function PemilikDashboardPage() {
  const { user } = useAuth();
  const { storeOrders, updateStoreOrderStatus, reportDamageDispute } = useBooking();
  const [photoBefore, setPhotoBefore] = React.useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = React.useState<string | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"pesanan" | "katalog">("pesanan");

  // Simulasi Filter Pesanan berdasarkan Nama Toko user yang login
  const myOrders = storeOrders.filter((o) => o.ownerName === user?.name);
  const lunasOrders = myOrders.filter((o) => o.status === "LUNAS" || o.status === "DIGUNAKAN");
  
  // Simulasi Filter Katalog Alat milik toko ini
  const { tools } = useTourism(); const myTools = tools.filter((t) => t.ownerName === user?.name);

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL TOKO ALAT</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal {user?.name || "Pemilik Barang"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("pesanan")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-sm border ${activeTab === "pesanan" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Pesanan Masuk</button>
            <button onClick={() => setActiveTab("katalog")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-sm border ${activeTab === "katalog" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Kelola Katalog Alat</button>
          </div>
        </div>

        {activeTab === "pesanan" && (
          <>
            <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#c5922e]" /> // INBOX CHAT & STATUS PESANAN (LUNAS)
              </h3>
              {lunasOrders.length === 0 ? (
                <p className="text-xs text-stone-500 font-mono py-2">Belum ada pesanan aktif masuk dari penyewa.</p>
              ) : (
                lunasOrders.map((ord) => (
                  <div key={ord.orderId} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-sm text-stone-900">Penyewa: {ord.clientName}</p>
                      <p className="text-stone-600 font-mono">ID: {ord.orderId} • Jadwal: {ord.startDate} s/d {ord.endDate}</p>
                      <span className="font-bold text-[#1d3a28] mt-1 inline-block">Status: {ord.status}</span>
                    </div>
                    <Link href={`/chat/${ord.orderId}`} className="px-4 py-2 bg-[#1d3a28] text-white text-xs font-bold uppercase font-mono rounded-sm flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 bg-stone-900 text-white p-6 rounded-sm border border-stone-800 text-center space-y-4">
                <span className="font-mono text-[10px] text-[#c5922e] uppercase font-bold tracking-widest block">// SCAN QR TIKET PENYEWA</span>
                <div className="w-40 h-40 mx-auto bg-stone-800 border border-dashed border-stone-600 rounded-sm flex flex-col items-center justify-center p-4">
                  <Camera className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
                </div>
                <button onClick={() => setScannedCode("TRX-GAMTARA-7890")} className="w-full py-2.5 bg-[#1d3a28] text-white font-mono text-xs uppercase font-bold rounded-sm cursor-pointer">
                  Simulasi Scan Tiket
                </button>
                {scannedCode && <p className="text-xs text-emerald-400 font-mono font-bold"><CheckCircle2 className="w-4 h-4 inline" /> Valid: {scannedCode}</p>}
              </div>

              <div className="md:col-span-7 bg-white border border-stone-300 rounded-sm p-6 space-y-4">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-2">
                  // VERIFIKASI FOTO KONDISI ALAT
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-[#f4f2eb] border border-stone-300 rounded-sm text-center">
                    <span className="text-[10px] font-mono font-bold block mb-2">FOTO SERAH (AWAL)</span>
                    {photoBefore ? <img src={photoBefore} alt="Before" className="w-full h-24 object-cover rounded-sm" /> : <button onClick={() => setPhotoBefore("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop")} className="w-full h-24 border border-dashed border-stone-400 rounded-sm flex flex-col items-center justify-center text-stone-500 bg-white"><Upload className="w-5 h-5" /></button>}
                  </div>
                  <div className="p-3 bg-[#f4f2eb] border border-stone-300 rounded-sm text-center">
                    <span className="text-[10px] font-mono font-bold block mb-2">FOTO KEMBALI (AKHIR)</span>
                    {photoAfter ? <img src={photoAfter} alt="After" className="w-full h-24 object-cover rounded-sm" /> : <button onClick={() => setPhotoAfter("https://images.unsplash.com/photo-1504280390467-336c18bf2288?w=400&auto=format&fit=crop")} className="w-full h-24 border border-dashed border-stone-400 rounded-sm flex flex-col items-center justify-center text-stone-500 bg-white"><Upload className="w-5 h-5" /></button>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { updateStoreOrderStatus(lunasOrders[0]?.orderId || "ORD", "SELESAI", photoBefore || undefined, photoAfter || undefined); alert("Selesai & Payout Dijadwalkan!"); }} className="flex-1 py-3 bg-[#1d3a28] text-white font-mono text-xs uppercase font-bold rounded-sm">Kondisi Aman (Selesai)</button>
                  <button onClick={() => { reportDamageDispute(lunasOrders[0]?.orderId || "ORD", photoBefore || "", photoAfter || "", 150000); alert("Dilaporkan Sengketa!"); }} className="px-4 py-3 bg-rose-700 text-white font-mono text-xs uppercase font-bold rounded-sm">Lapor Rusak</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "katalog" && (
          <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
             <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28]">
                  // DAFTAR ALAT SEWA SAYA
                </h3>
                <button onClick={() => alert("Form Tambah Alat Dibuka")} className="px-4 py-2 bg-[#1d3a28] text-white font-mono text-xs font-bold uppercase rounded-sm flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Tambah Alat
                </button>
             </div>
             {myTools.length === 0 ? (
               <p className="text-xs text-stone-500 font-mono py-4 text-center">Belum ada alat di katalog Anda.</p>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {myTools.map((t) => (
                   <div key={t.id} className="flex gap-4 p-3 border border-stone-200 bg-[#f4f2eb] rounded-sm items-center">
                     <img src={t.img} className="w-16 h-16 rounded-sm object-cover border border-stone-300" />
                     <div className="flex-1 text-xs">
                       <p className="font-bold text-sm text-stone-900">{t.name}</p>
                       <p className="text-stone-600 font-mono">Stok: {t.stock} | Rp {t.price.toLocaleString("id-ID")}</p>
                     </div>
                     <div className="flex flex-col gap-1">
                       <button className="p-1.5 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded"><Pencil className="w-3.5 h-3.5"/></button>
                       <button className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </div>
    </main>
  );
}
