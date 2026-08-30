"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { ShieldAlert, DollarSign, UserCheck, Check, ShieldX } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, registeredUsers, approveMitra, isLoaded } = useAuth();
  const { disputes, payouts, resolveDispute } = useBooking();

  // FIX: Proteksi Keamanan (Hanya Admin yang bisa akses)
  if (isLoaded && (!user || user.role !== "admin")) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-none border border-stone-300 shadow-lg mt-12 space-y-4">
          <ShieldX className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Ditolak</h2>
          <p className="text-xs text-stone-600">Halaman ini adalah Pusat Kendali SuperAdmin. Anda tidak memiliki otorisasi.</p>
          <Link href="/" className="inline-block bg-[#1d3a28] text-white px-6 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const pendingMitra = registeredUsers.filter((u) => u.status === "pending_approval");

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// PUSAT KENDALI SUPERADMIN</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Manajemen & Dispute</h1>
        </div>

        <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#1d3a28]" /> // VERIFIKASI MITRA BARU ({pendingMitra.length})
          </h3>
          {pendingMitra.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-2">Tidak ada mitra baru yang menunggu verifikasi.</p>
          ) : (
            <div className="space-y-3">
              {pendingMitra.map((m) => (
                <div key={m.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-none flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-sm text-stone-900">{m.name} ({m.role.toUpperCase()})</p>
                    <p className="text-stone-600 font-mono">{m.email} • {m.phone} • {m.origin}</p>
                  </div>
                  <button onClick={() => approveMitra(m.id)} className="px-4 py-2 bg-[#1d3a28] hover:bg-[#152a1b] text-white text-xs font-bold uppercase font-mono rounded-none flex items-center gap-1.5 cursor-pointer">
                    <Check className="w-4 h-4" /> Setujui Mitra
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispute & Payout Sections Omitted for Brevity (Logic Remains Same) */}
      </div>
    </main>
  );
}
