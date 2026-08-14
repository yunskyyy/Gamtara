"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { User, Phone, MapPin, Mail, Upload, Ticket, MessageSquare, Store, Compass } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateAvatar } = useAuth();
  const { storeOrders, guideRequests } = useBooking();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-sm mt-12 space-y-4">
          <h2 className="text-xl font-bold">Silakan Masuk Terlebih Dahulu</h2>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-sm font-mono text-xs uppercase font-bold">Kembali</button>
        </div>
      </main>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      updateAvatar(previewUrl);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// OTORISASI AKUN AKTIF</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Profil Saya</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card Data Diri & Upload Foto Asli */}
          <div className="md:col-span-4 bg-white border border-stone-300 rounded-sm p-6 text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-stone-100 border border-stone-300 group">
              <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"} alt={user.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono cursor-pointer"
              >
                <Upload className="w-4 h-4 mb-1" />
                <span>Pilih Foto</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

            <div>
              <h2 className="text-lg font-extrabold text-stone-900">{user.name}</h2>
              <span className="inline-block px-2.5 py-0.5 bg-[#1d3a28] text-white text-[10px] font-mono font-bold uppercase mt-1">
                {user.role === "customer" ? "WISATAWAN (PENYEWA)" : user.role === "pemilik" ? "PEMILIK BARANG" : user.role === "pemandu" ? "PEMANDU WISATA" : "SUPERADMIN"}
              </span>
            </div>

            <div className="pt-4 border-t border-stone-200 text-left text-xs space-y-2 font-sans">
              <p className="text-stone-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#1d3a28]" /> {user.email}</p>
              <p className="text-stone-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#1d3a28]" /> {user.phone}</p>
              <p className="text-stone-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#1d3a28]" /> Asal: {user.origin}</p>
              <p className="text-stone-700 flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#1d3a28]" /> Gender: {user.gender}</p>
            </div>
          </div>

          {/* Contextual Orders & History by Role */}
          <div className="md:col-span-8 space-y-6">
            {/* 1. KHUSUS PENYEWA (WISATAWAN) */}
            {user.role === "customer" && (
              <>
                {/* Pesanan Alat Sewa per Toko */}
                <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
                  <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#1d3a28]" /> Riwayat Pesanan Alat Sewa (Dipisahkan per Toko)
                  </h3>
                  {storeOrders.map((ord) => (
                    <div key={ord.orderId} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-stone-300 pb-2">
                        <span className="font-mono font-bold text-[#1d3a28]">{ord.orderId} — {ord.ownerName}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">{ord.status}</span>
                      </div>
                      <p className="text-stone-600"><strong>Item:</strong> {ord.items.map((i) => i.name).join(", ")}</p>
                      <p className="text-stone-600 font-mono"><strong>Jadwal Sewa:</strong> {ord.startDate} s/d {ord.endDate}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-[#1d3a28] font-mono">Total: Rp {ord.totalPrice.toLocaleString("id-ID")}</span>
                        <Link href="/ticket/TRX-GAMTARA-7890" className="px-3 py-1.5 bg-[#1d3a28] text-white text-[11px] font-bold uppercase rounded-sm flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5" /> E-Tiket QR
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Riwayat Permintaan Pemandu Wisata */}
                <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
                  <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1d3a28]" /> Riwayat Permintaan Pemandu Wisata
                  </h3>
                  {guideRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <p className="font-bold text-sm text-stone-900">{req.guideName} ({req.selectedDestination})</p>
                        <p className="text-stone-500 font-mono">Tarif: Rp {req.price.toLocaleString("id-ID")} / hari</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                          STATUS: {req.status}
                        </span>
                      </div>
                      {req.status === "LUNAS" && (
                        <Link href={`/chat/${req.id}`} className="px-4 py-2 bg-[#1d3a28] hover:bg-[#152a1b] text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 2. KHUSUS MITRA (PEMILIK BARANG & PEMANDU WISATA) */}
            {(user.role === "pemilik" || user.role === "pemandu") && (
              <div className="bg-white border border-stone-300 rounded-sm p-6 text-center space-y-4">
                <h3 className="text-base font-extrabold">Portal Operasional Mitra Aktif</h3>
                <p className="text-xs text-stone-600">Kelola pesanan masuk, verifikasi foto alat sebelum/sesudah, dan konfirmasi jadwal klien di Dashboard Mitra.</p>
                <Link href="/vendor/dashboard" className="inline-block px-6 py-3 bg-[#1d3a28] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-sm">
                  Buka Dashboard Operasional Mitra
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}