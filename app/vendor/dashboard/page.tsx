"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { Camera, CheckCircle2, Upload } from "lucide-react";

export default function VendorDashboardPage() {
  const [scannedToken, setScannedToken] = React.useState<string | null>(null);
  const [photoBefore, setPhotoBefore] = React.useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = React.useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// PORTAL MITRA VENDOR & GUIDE</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Fulfillment Operasional</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-stone-900 text-white p-6 rounded-xl border border-stone-800 shadow-xl space-y-6 text-center">
            <h3 className="font-mono text-xs font-bold text-[#c5922e] uppercase tracking-widest">// SIMULASI SCANNER QR TIKET</h3>
            <div className="w-48 h-48 mx-auto bg-stone-800 rounded-xl border-2 border-dashed border-stone-600 flex flex-col items-center justify-center p-4">
              <Camera className="w-10 h-10 text-emerald-400 mb-2 animate-pulse" />
              <span className="text-[10px] font-mono text-stone-400">Arahkan Kamera ke Tiket Wisatawan</span>
            </div>
            
            <button onClick={() => setScannedToken("GAMTARA-7890")} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-colors cursor-pointer border border-emerald-800">
              Simulasi Scan Tiket Wisatawan
            </button>

            {scannedToken && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tiket Valid: {scannedToken}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-7 bg-white p-6 rounded-xl border border-stone-300 shadow-sm space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3">
              Verifikasi Foto Kondisi Alat (Pencegahan Sengketa)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f4f2eb] rounded-xl border border-stone-300 text-center space-y-3">
                <span className="font-mono text-[10px] font-bold text-stone-600 block uppercase">// FOTO KONDISI AWAL (SERAH)</span>
                {photoBefore ? (
                  <img src={photoBefore} alt="Before" className="w-full h-32 object-cover rounded-xl border border-stone-300" />
                ) : (
                  <button onClick={() => setPhotoBefore("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&auto=format&fit=crop")} className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer bg-white">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-mono">Upload Foto Sebelum</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-[#f4f2eb] rounded-xl border border-stone-300 text-center space-y-3">
                <span className="font-mono text-[10px] font-bold text-stone-600 block uppercase">// FOTO KONDISI AKHIR (KEMBALI)</span>
                {photoAfter ? (
                  <img src={photoAfter} alt="After" className="w-full h-32 object-cover rounded-xl border border-stone-300" />
                ) : (
                  <button onClick={() => setPhotoAfter("https://images.unsplash.com/photo-1504280390467-336c18bf2288?w=400&auto=format&fit=crop")} className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer bg-white">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-mono">Upload Foto Pengembalian</span>
                  </button>
                )}
              </div>
            </div>

            <button onClick={() => alert("Kondisi Alat Terverifikasi Aman! Payout Dana Dijadwalkan.")} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white rounded-xl font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-md">
              Konfirmasi Pengembalian & Selesaikan Transaksi
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
