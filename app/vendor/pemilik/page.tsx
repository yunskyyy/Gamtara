"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { Camera, CheckCircle2, MessageSquare, Store, Upload } from "lucide-react";

export default function PemilikDashboardPage() {
  const { storeOrders } = useBooking();
  const [photoBefore, setPhotoBefore] = React.useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = React.useState<string | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);

  const lunasOrders = storeOrders.filter((o) => o.status === "LUNAS");

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL TOKO ALAT</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal Pemilik Barang</h1>
        </div>

        {/* 1. Inbox Chat Penyewa yang Sudah Lunas */}
        <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#c5922e]" /> // INBOX CHAT PENYEWA (PEMBAYARAN LUNAS)
          </h3>
          {lunasOrders.map((ord) => (
            <div key={ord.orderId} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-sm text-stone-900">Penyewa: {ord.clientName}</p>
                <p className="text-stone-600 font-mono">ID Pesanan: {ord.orderId} • Jadwal: {ord.startDate} s/d {ord.endDate}</p>
              </div>
              <Link href={`/chat/${ord.orderId}`} className="px-4 py-2 bg-[#1d3a28] text-white text-xs font-bold uppercase font-mono rounded-sm flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat
              </Link>
            </div>
          ))}
        </div>

        {/* 2. Verifikasi QR & Foto Before/After */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-stone-900 text-white p-6 rounded-sm border border-stone-800 text-center space-y-4">
            <span className="font-mono text-[10px] text-[#c5922e] uppercase font-bold tracking-widest block">// SCAN QR TIKET PENYEWA</span>
            <div className="w-40 h-40 mx-auto bg-stone-800 border border-dashed border-stone-600 rounded-sm flex flex-col items-center justify-center p-4">
              <Camera className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
              <span className="text-[10px] font-mono text-stone-400">Arahkan Kamera</span>
            </div>
            <button onClick={() => setScannedCode("TRX-GAMTARA-7890")} className="w-full py-2.5 bg-[#1d3a28] text-white font-mono text-xs uppercase font-bold rounded-sm cursor-pointer">
              Simulasi Scan Tiket
            </button>
            {scannedCode && <p className="text-xs text-emerald-400 font-mono font-bold flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Valid: {scannedCode}</p>}
          </div>

          <div className="md:col-span-7 bg-white border border-stone-300 rounded-sm p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-2">
              // VERIFIKASI FOTO KONDISI ALAT
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#f4f2eb] border border-stone-300 rounded-sm text-center space-y-2">
                <span className="text-[10px] font-mono font-bold block">FOTO SERAH (AWAL)</span>
                {photoBefore ? <img src={photoBefore} alt="Before" className="w-full h-24 object-cover rounded-sm" /> : <button onClick={() => setPhotoBefore("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop")} className="w-full h-24 border border-dashed border-stone-400 rounded-sm flex flex-col items-center justify-center text-stone-500 bg-white cursor-pointer"><Upload className="w-5 h-5 mb-1" /><span className="text-[9px] font-mono">Upload Foto</span></button>}
              </div>
              <div className="p-3 bg-[#f4f2eb] border border-stone-300 rounded-sm text-center space-y-2">
                <span className="text-[10px] font-mono font-bold block">FOTO KEMBALI (AKHIR)</span>
                {photoAfter ? <img src={photoAfter} alt="After" className="w-full h-24 object-cover rounded-sm" /> : <button onClick={() => setPhotoAfter("https://images.unsplash.com/photo-1504280390467-336c18bf2288?w=400&auto=format&fit=crop")} className="w-full h-24 border border-dashed border-stone-400 rounded-sm flex flex-col items-center justify-center text-stone-500 bg-white cursor-pointer"><Upload className="w-5 h-5 mb-1" /><span className="text-[9px] font-mono">Upload Foto</span></button>}
              </div>
            </div>
            <button onClick={() => alert("Pengembalian Alat Selesai & Payout Dijadwalkan!")} className="w-full py-3 bg-[#1d3a28] text-white font-mono text-xs uppercase font-bold rounded-sm cursor-pointer shadow-md">
              Konfirmasi Pengembalian Barang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}